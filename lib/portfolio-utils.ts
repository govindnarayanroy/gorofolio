import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Generate a unique portfolio slug for a user
 */
export async function generateUniqueSlug(
  userName: string, 
  userId: string,
  existingSlug?: string
): Promise<string> {
  // If we have an existing slug, keep it (for updates)
  if (existingSlug) {
    return existingSlug
  }
  
  // Create base slug: lowercase, replace spaces with hyphens, remove special chars
  let baseSlug = userName
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
  
  // Ensure slug is not empty
  if (!baseSlug) {
    baseSlug = `user-${userId.substring(0, 8)}`
  }
  
  // Check for uniqueness and add counter if needed
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handle server component context
          }
        },
      },
    }
  )
  
  let finalSlug = baseSlug
  let counter = 0
  
  while (true) {
    const { data: existing } = await supabase
      .from('portfolios')
      .select('slug')
      .eq('slug', finalSlug)
      .single()
    
    if (!existing) {
      break // Slug is unique
    }
    
    counter++
    finalSlug = `${baseSlug}-${counter}`
  }
  
  return finalSlug
}

/**
 * Get or create a unique slug for a user's portfolio
 */
export async function getOrCreatePortfolioSlug(
  userName: string,
  userId: string
): Promise<string> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Handle server component context
          }
        },
      },
    }
  )
  
  // Check if user already has a portfolio with a slug
  const { data: existingPortfolio } = await supabase
    .from('portfolios')
    .select('slug')
    .eq('user_id', userId)
    .single()
  
  if (existingPortfolio?.slug) {
    return existingPortfolio.slug
  }
  
  // Generate new unique slug
  return generateUniqueSlug(userName, userId)
} 