export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import pdf from 'pdf-parse'
import { chatLLM } from '@/lib/llmClient'
import { Profile } from '@/lib/types'
import fs from 'node:fs/promises'
import path from 'node:path'
import { createClient } from '@/lib/supabase-server'

const MAX_SIZE = 4 * 1024 * 1024 // 4 MB

// Add CORS headers for production
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// Production deployment with GROQ_API_KEY configured
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function POST(req: Request) {
  try {
    console.log('📥 Ingest API called')

    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log('❌ Authentication failed:', authError)
      return NextResponse.json(
        { error: 'Unauthorized', details: authError?.message },
        { status: 401, headers: corsHeaders }
      )
    }

    let form: FormData
    try {
      form = await req.formData()
    } catch (formError) {
      console.error('❌ FormData parsing failed:', formError)
      return NextResponse.json(
        { error: 'Invalid form data', details: formError instanceof Error ? formError.message : 'Unknown error' },
        { status: 400, headers: corsHeaders }
      )
    }

    const file = form.get('file') as File

    console.log(
      '📋 FormData entries:',
      Array.from(form.entries()).map(([key, value]) => [
        key,
        typeof value,
        value instanceof File ? `File(${value.name}, ${value.size}b)` : value,
      ])
    )

    console.log('📁 File details:', {
      exists: !!file,
      name: file?.name,
      size: file?.size,
      type: file?.type,
      lastModified: file?.lastModified,
    })

    if (!file) {
      console.log('❌ No file provided')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400, headers: corsHeaders }
      )
    }

    if (file.size > MAX_SIZE) {
      console.log('❌ File too large:', file.size)
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_SIZE / 1024 / 1024}MB` },
        { status: 400, headers: corsHeaders }
      )
    }

    if (file.type !== 'application/pdf') {
      console.log('❌ Invalid file type:', file.type)
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400, headers: corsHeaders }
      )
    }

    console.log('✅ File validation passed')
    console.log('📄 Extracting text from PDF...')

    let buffer: Buffer
    try {
      buffer = Buffer.from(await file.arrayBuffer())
      console.log('📦 Buffer size:', buffer.length)
    } catch (bufferError) {
      console.error('❌ Buffer creation failed:', bufferError)
      return NextResponse.json(
        { error: 'Failed to process file' },
        { status: 500, headers: corsHeaders }
      )
    }

    let text: string
    try {
      const result = await pdf(buffer)
      text = result.text
      console.log('📝 Extracted text length:', text.length)
      console.log('📝 Text preview:', text.slice(0, 200) + '...')
    } catch (pdfError) {
      console.error('❌ PDF parsing failed:', pdfError)
      return NextResponse.json(
        { error: 'Failed to extract text from PDF. Please ensure the PDF is not corrupted or password-protected.' },
        { status: 400, headers: corsHeaders }
      )
    }

    if (!text || text.trim().length < 50) {
      console.log('❌ Insufficient text extracted')
      return NextResponse.json(
        { error: 'Could not extract sufficient text from PDF. Please ensure the PDF contains readable text.' },
        { status: 400, headers: corsHeaders }
      )
    }

    console.log('🤖 Building LLM prompt...')
    let prompt: string
    try {
      const tpl = await fs.readFile(path.join(process.cwd(), 'prompts/parse-resume.md'), 'utf8')
      prompt = tpl.replace('{{resume_text}}', text.slice(0, 60000))
      console.log('📝 Prompt length:', prompt.length)
    } catch (promptError) {
      console.error('❌ Prompt template loading failed:', promptError)
      // Fallback prompt if file is missing
      console.log('⚠️ Using fallback prompt...')
      prompt = `## System

You are an AI that converts raw résumé text into valid JSON matching the Profile schema.

## Instructions

SRC:

\`\`\`
${text.slice(0, 60000)}
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
      "start": "YYYY-MM",
      "end": "YYYY-MM or null",
      "bullets": []
    }
  ],
  "education": [{ "school": "", "degree": "", "year": "" }],
  "skills": [],
  "links": []
}
\`\`\`

_Do not wrap in Markdown fences; no additional keys._
**Output strictly:** raw minified JSON only — **NO Markdown fences, NO extra text**.`
      console.log('📝 Fallback prompt length:', prompt.length)
    }

    console.log('🧠 Calling LLM for parsing...')
    let res: any
    try {
      res = await chatLLM('groq', 'llama3-8b-8192', [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ])

      console.log('🤖 LLM response length:', res.content?.length)
      console.log('🤖 LLM response preview:', res.content?.slice(0, 200) + '...')
    } catch (llmError) {
      console.error('❌ LLM call failed:', llmError)
      return NextResponse.json(
        { error: 'AI processing failed. Please try again.' },
        { status: 500, headers: corsHeaders }
      )
    }

    let profile: Profile
    try {
      // Clean the response to extract JSON
      let jsonStr = res.content ?? ''

      // Remove markdown code blocks if present
      jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '')

      // Find the JSON object
      const jsonStart = jsonStr.indexOf('{')
      const jsonEnd = jsonStr.lastIndexOf('}')

      if (jsonStart !== -1 && jsonEnd !== -1) {
        jsonStr = jsonStr.slice(jsonStart, jsonEnd + 1)
      }

      console.log('🔧 Sanitized JSON length:', jsonStr.length)
      console.log('🔧 Sanitized JSON preview:', jsonStr.slice(0, 200) + '...')

      profile = JSON.parse(jsonStr)
      console.log('✅ JSON parsing successful')
      console.log('👤 Parsed profile:', {
        name: profile.name,
        headline: profile.headline,
        experienceCount: profile.experiences?.length || 0,
        skillsCount: profile.skills?.length || 0,
      })
    } catch (parseError) {
      console.error('❌ JSON parsing failed:', parseError)
      return NextResponse.json(
        { error: 'Failed to parse resume content. Please try with a different PDF.' },
        { status: 500, headers: corsHeaders }
      )
    }

    // Save the parsed profile to the database
    console.log('💾 Saving profile to database...')
    try {
      // Check if user already has a resume
      const { data: existingResume } = await supabase
        .from('resumes')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (existingResume) {
        // Update existing resume
        const { data: updatedResume, error: updateError } = await supabase
          .from('resumes')
          .update({
            data: profile,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .select()
          .single()

        if (updateError) {
          console.error('❌ Database update error:', updateError)
          throw updateError
        }

        console.log('✅ Resume updated in database')
      } else {
        // Create new resume
        const { data: newResume, error: insertError } = await supabase
          .from('resumes')
          .insert({
            user_id: user.id,
            data: profile,
          })
          .select()
          .single()

        if (insertError) {
          console.error('❌ Database insert error:', insertError)
          throw insertError
        }

        console.log('✅ Resume created in database')
      }
    } catch (dbError) {
      console.error('❌ Database operation failed:', dbError)
      // Continue without failing the request - the profile is still parsed successfully
      console.log('⚠️ Continuing without database save...')
    }

    console.log('🎉 Ingestion successful!')
    return NextResponse.json({ profile }, { headers: corsHeaders })
  } catch (err) {
    console.error('❌ Ingestion error:', err)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    )
  }
}
