export const runtime = 'nodejs'
export const maxDuration = 60

import { NextResponse } from 'next/server'
import { chatLLM } from '@/lib/llmClient'
import { Profile } from '@/lib/types'
import { createClient } from '@/lib/supabase-server'
// @ts-ignore - pdf2json doesn't have types
import PDFParser from 'pdf2json'

const MAX_SIZE = 4 * 1024 * 1024 // 4 MB

// Inline prompt template for serverless compatibility
const RESUME_PARSE_PROMPT = `## System

You are an AI that converts raw résumé text into valid JSON matching the Profile schema.

## Instructions

SRC:

\`\`\`
{{resume_text}}
\`\`\`

Return **ONLY** this JSON:

\`\`\`json
{
  "name": "",
  "headline": "",
  "summary": "",
  "experiences": [
    {
      "company": "",
      "role": "",
      "startDate": "",
      "endDate": "",
      "description": "",
      "achievements": []
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "",
      "endDate": "",
      "gpa": ""
    }
  ],
  "skills": [
    {
      "name": "",
      "level": "Beginner|Intermediate|Advanced|Expert"
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": [],
      "startDate": "",
      "endDate": "",
      "url": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "issuer": "",
      "date": "",
      "url": ""
    }
  ],
  "languages": [
    {
      "name": "",
      "proficiency": "Basic|Conversational|Fluent|Native"
    }
  ],
  "contact": {
    "email": "",
    "phone": "",
    "location": "",
    "website": "",
    "linkedin": "",
    "github": ""
  }
}
\`\`\`

## Rules
- Extract ALL information from the résumé
- Use exact text from the résumé
- If information is missing, use empty string ""
- For arrays, include all relevant items
- Dates should be in "YYYY-MM" or "YYYY" format
- Return ONLY the JSON, no other text`

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  console.log('📄 Extracting text from PDF with pdf2json...')
  console.log('📦 Buffer size:', buffer.length)
  console.log('🌍 Environment:', process.env.NODE_ENV)
  console.log('🔧 Runtime:', process.env.VERCEL ? 'Vercel' : 'Local')
  
  return new Promise((resolve, reject) => {
    try {
      const pdfParser = new PDFParser()
      
      // Set up event handlers
      pdfParser.on('pdfParser_dataError', (errData: any) => {
        console.error('❌ PDF parsing error:', errData.parserError)
        reject(new Error(`PDF parsing failed: ${errData.parserError}`))
      })
      
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          console.log('✅ PDF parsed successfully')
          
          // Extract text from all pages
          let extractedText = ''
          
          if (pdfData.Pages && Array.isArray(pdfData.Pages)) {
            console.log(`📄 Processing ${pdfData.Pages.length} pages`)
            for (const page of pdfData.Pages) {
              if (page.Texts && Array.isArray(page.Texts)) {
                for (const textItem of page.Texts) {
                  if (textItem.R && Array.isArray(textItem.R)) {
                    for (const run of textItem.R) {
                      if (run.T) {
                        try {
                          // Decode URI component and add to text
                          const decodedText = decodeURIComponent(run.T)
                          extractedText += decodedText + ' '
                        } catch (decodeError) {
                          // If decoding fails, use the raw text
                          console.warn('⚠️ Failed to decode text, using raw:', run.T)
                          extractedText += run.T + ' '
                        }
                      }
                    }
                  }
                }
              }
              // Add line break between pages
              extractedText += '\n'
            }
          } else {
            console.error('❌ No pages found in PDF data')
            reject(new Error('No readable content found in PDF'))
            return
          }
          
          // Clean up the text
          extractedText = extractedText
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\n\s*\n/g, '\n') // Replace multiple newlines with single newline
            .trim()
          
          console.log('📝 Extracted text length:', extractedText.length)
          console.log('📝 Text preview:', extractedText.substring(0, 200) + '...')
          
          if (extractedText.length < 50) {
            console.error('❌ Insufficient text extracted:', extractedText.length, 'characters')
            reject(new Error('Could not extract sufficient text from PDF. Please ensure the PDF contains readable text and is not password-protected.'))
            return
          }
          
          resolve(extractedText)
        } catch (error) {
          console.error('❌ Error processing PDF data:', error)
          reject(new Error('Failed to process PDF data'))
        }
      })
      
      // Parse the PDF buffer
      console.log('🔄 Starting PDF parsing...')
      pdfParser.parseBuffer(buffer)
    } catch (error) {
      console.error('❌ Error initializing PDF parser:', error)
      reject(new Error('Failed to initialize PDF parser'))
    }
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(request: Request) {
  try {
    console.log('📥 Ingest API called')
    
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log('❌ Authentication failed:', authError)
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    console.log('📋 FormData entries:', Array.from(formData.entries()).map(([key, value]) => [
      key, 
      typeof value, 
      value instanceof File ? `File(${value.name}, ${value.size}b)` : value
    ]))
    
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log('📁 File details:', {
      exists: !!file,
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    })

    // Validate file
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 4MB.' },
        { status: 400 }
      )
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported.' },
        { status: 400 }
      )
    }

    console.log('✅ File validation passed')

    // Extract text from PDF
    console.log('📄 Extracting text from PDF...')
    const buffer = Buffer.from(await file.arrayBuffer())
    const extractedText = await extractTextFromPDF(buffer)

    // Build prompt
    console.log('🤖 Building LLM prompt...')
    const prompt = RESUME_PARSE_PROMPT.replace('{{resume_text}}', extractedText)
    console.log('📝 Prompt length:', prompt.length)

    // Call LLM
    console.log('🧠 Calling LLM for parsing...')
    const response = await chatLLM('groq', 'llama3-8b-8192', [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt },
    ])
    console.log('🤖 LLM response length:', response.content?.length || 0)
    console.log('🤖 LLM response preview:', (response.content || '').substring(0, 200) + '...')

    // Sanitize JSON response
    let jsonStr = (response.content || '').trim()
    
    // Remove any text before the first { and after the last }
    const firstBrace = jsonStr.indexOf('{')
    const lastBrace = jsonStr.lastIndexOf('}')
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      jsonStr = jsonStr.substring(firstBrace, lastBrace + 1)
    }
    
    // Also handle markdown code blocks
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.replace(/^.*```json\s*/, '').replace(/\s*```.*$/, '')
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.replace(/^.*```\s*/, '').replace(/\s*```.*$/, '')
    }
    
    console.log('🔧 Sanitized JSON length:', jsonStr.length)
    console.log('🔧 Sanitized JSON preview:', jsonStr.substring(0, 200) + '...')

    // Parse JSON
    let llmProfile: any
    try {
      llmProfile = JSON.parse(jsonStr)
      console.log('✅ JSON parsing successful')
      console.log('👤 Parsed LLM profile:', {
        name: llmProfile.name,
        headline: llmProfile.headline,
        experienceCount: llmProfile.experiences?.length || 0,
        skillsCount: llmProfile.skills?.length || 0
      })
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError)
      console.error('🔧 Raw response:', response.content)
      return NextResponse.json(
        { error: 'Failed to parse resume data. Please try again.' },
        { status: 400 }
      )
    }

    // Transform LLM response to match Profile schema
    const profile: Profile = {
      name: llmProfile.name || '',
      headline: llmProfile.headline || '',
      summary: llmProfile.summary || '',
      experiences: (llmProfile.experiences || []).map((exp: any) => ({
        company: exp.company || '',
        role: exp.role || '',
        start: exp.startDate || '',
        end: exp.endDate === 'PRESENT' ? undefined : exp.endDate || '',
        bullets: exp.description ? [exp.description] : exp.achievements || []
      })),
      education: (llmProfile.education || []).map((edu: any) => ({
        school: edu.institution || '',
        degree: edu.degree || '',
        year: edu.endDate || edu.startDate || ''
      })),
      skills: (llmProfile.skills || []).map((skill: any) => 
        typeof skill === 'string' ? skill : skill.name || ''
      ),
      links: []
    }

    // Add contact links if available
    if (llmProfile.contact) {
      if (llmProfile.contact.linkedin) {
        profile.links.push({ label: 'LinkedIn', url: llmProfile.contact.linkedin })
      }
      if (llmProfile.contact.github) {
        profile.links.push({ label: 'GitHub', url: llmProfile.contact.github })
      }
      if (llmProfile.contact.website) {
        profile.links.push({ label: 'Website', url: llmProfile.contact.website })
      }
    }

    console.log('🔄 Transformed profile:', {
      name: profile.name,
      headline: profile.headline,
      experienceCount: profile.experiences.length,
      educationCount: profile.education.length,
      skillsCount: profile.skills.length,
      linksCount: profile.links.length
    })

    // Save to database
    console.log('💾 Saving profile to database...')
    console.log('👤 Profile data to save:', {
      id: user.id,
      name: profile.name,
      headline: profile.headline,
      experienceCount: profile.experiences?.length || 0,
      skillsCount: profile.skills?.length || 0,
      educationCount: profile.education?.length || 0
    })
    console.log('📋 Full profile structure:', JSON.stringify(profile, null, 2))
    
    // Check if resume exists
    const { data: existing } = await supabase
      .from('resumes')
      .select('id')
      .eq('user_id', user.id)
      .single()

    let result
    if (existing) {
      // Update existing resume
      const { data, error } = await supabase
        .from('resumes')
        .update({
          data: profile,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()

      if (error) {
        console.error('❌ Database error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        return NextResponse.json(
          { error: 'Failed to update resume in database' },
          { status: 500 }
        )
      }
      result = data
      console.log('✅ Resume updated in database')
    } else {
      // Create new resume
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          data: profile,
        })
        .select()

      if (error) {
        console.error('❌ Database error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        return NextResponse.json(
          { error: 'Failed to create resume in database' },
          { status: 500 }
        )
      }
      result = data
      console.log('✅ Resume created in database')
    }

    console.log('🎉 Ingestion successful!')

    return NextResponse.json({ 
      success: true, 
      message: 'Resume processed successfully',
      profile: result?.[0] || profile
    })

  } catch (error) {
    console.error('❌ PDF parsing failed:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'Failed to extract text from PDF. Please ensure the PDF is not corrupted or password-protected.'
      },
      { status: 400 }
    )
  }
}
