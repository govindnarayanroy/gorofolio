import { createClient } from './supabase'
import { Profile } from './types'

export interface ResumeRecord {
  id: string
  user_id: string
  data: Profile
  created_at: string
  updated_at: string
}

export interface PortfolioRecord {
  id: string
  user_id: string
  slug: string
  url: string | null
  resume_id: string | null
  created_at: string
  updated_at: string
}

// Client-side functions using API routes
export async function getUserResume(): Promise<ResumeRecord | null> {
  try {
    const response = await fetch('/api/resume', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized')
      }
      throw new Error('Failed to fetch resume')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error fetching resume:', error)
    return null
  }
}

export async function saveResume(profileData: Profile): Promise<ResumeRecord | null> {
  try {
    const response = await fetch('/api/resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized')
      }
      throw new Error('Failed to save resume')
    }

    const result = await response.json()
    return result.data
  } catch (error) {
    console.error('Error saving resume:', error)
    throw error
  }
}

export async function getUserPortfolio(): Promise<PortfolioRecord | null> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching portfolio:', error)
    return null
  }

  return data
}

export async function savePortfolio(
  url: string,
  resumeId: string
): Promise<PortfolioRecord | null> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  // Check if portfolio exists
  const existing = await getUserPortfolio()

  if (existing) {
    // Update existing portfolio
    const { data, error } = await supabase
      .from('portfolios')
      .update({
        url,
        resume_id: resumeId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating portfolio:', error)
      throw error
    }

    return data
  } else {
    // Create new portfolio
    const { data, error } = await supabase
      .from('portfolios')
      .insert({
        user_id: user.id,
        url,
        resume_id: resumeId,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating portfolio:', error)
      throw error
    }

    return data
  }
}
