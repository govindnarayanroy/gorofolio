export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { Profile } from '@/lib/types'

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching resume:', error)
      return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 })
    }

    // If we have data, merge the image_url into the profile data
    if (data && data.data) {
      const profileWithImage = {
        ...data.data,
        image_url: data.image_url
      }
      return NextResponse.json({ data: { ...data, data: profileWithImage } })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Resume GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profileData: Profile = await req.json()

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
          data: profileData,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating resume:', error)
        return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 })
      }
      result = data
    } else {
      // Create new resume
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          data: profileData,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating resume:', error)
        return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 })
      }
      result = data
    }

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('Resume POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
