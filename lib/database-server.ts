import { createClient as createServerClient } from './supabase-server'
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

// Server-side functions
export async function getServerUserResume(userId: string): Promise<ResumeRecord | null> {
  const supabase = await createServerClient()

  const { data, error } = await supabase.from('resumes').select('*').eq('user_id', userId).single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching resume:', error)
    return null
  }

  return data
}

export async function getServerUserPortfolio(userId: string): Promise<PortfolioRecord | null> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching portfolio:', error)
    return null
  }

  return data
}
