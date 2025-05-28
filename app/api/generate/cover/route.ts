import { NextResponse } from 'next/server'
import { z } from 'zod'
import { chatLLM } from '@/lib/llmClient'
import { Profile } from '@/lib/types'
import { readFileSync } from 'fs'
import { join } from 'path'

// Input validation schema
const Body = z.object({
  profile: z.custom<Profile>(), // Using the Profile type from lib/types.ts
  jd: z.string().min(1),
  tone: z.enum(['professional', 'friendly', 'enthusiastic']).optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { profile, jd, tone = 'professional' } = Body.parse(body)

    // Read and interpolate prompt template
    const promptPath = join(process.cwd(), 'prompts', 'cover-letter.md')
    let prompt = readFileSync(promptPath, 'utf-8')

    // Replace placeholders with actual values
    prompt = prompt
      .replace('{{profile}}', JSON.stringify(profile, null, 2))
      .replace('{{jd}}', jd)
      .replace('{{tone}}', tone)

    // Split prompt into system and user messages
    const [systemMsg, userMsg] = prompt.split('## User Instructions')

    // Call LLM with the prompt
    const response = await chatLLM('groq', 'llama3-8b-8192', [
      { role: 'system', content: systemMsg.replace('## System\n', '').trim() },
      { role: 'user', content: userMsg.trim() },
    ])

    if (!response?.content) {
      throw new Error('No content in LLM response')
    }

    return NextResponse.json({ markdown: response.content })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Cover letter generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
