-- Migration: Add slug field to portfolios table
-- Run this in your Supabase SQL Editor if you have an existing portfolios table

-- Add slug column to portfolios table
ALTER TABLE portfolios ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug (will be enforced when we populate slugs)
-- We'll add the unique constraint after populating existing rows

-- Function to generate slug from user data
CREATE OR REPLACE FUNCTION generate_portfolio_slug(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  user_name TEXT;
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Get user's name from resumes table
  SELECT COALESCE(
    (data->>'name'),
    split_part(email, '@', 1)
  ) INTO user_name
  FROM resumes r
  LEFT JOIN auth.users u ON r.user_id = u.id
  WHERE r.user_id = user_uuid
  LIMIT 1;
  
  -- If no name found, use user ID prefix
  IF user_name IS NULL THEN
    user_name := 'user-' || substring(user_uuid::text, 1, 8);
  END IF;
  
  -- Create base slug: lowercase, replace spaces with hyphens, remove special chars
  base_slug := lower(regexp_replace(
    regexp_replace(user_name, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+', '-', 'g'
  ));
  
  -- Ensure slug is not empty
  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'user-' || substring(user_uuid::text, 1, 8);
  END IF;
  
  final_slug := base_slug;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (SELECT 1 FROM portfolios WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Populate slug for existing portfolios
UPDATE portfolios 
SET slug = generate_portfolio_slug(user_id)
WHERE slug IS NULL;

-- Now add the unique constraint
ALTER TABLE portfolios 
ADD CONSTRAINT portfolios_slug_unique UNIQUE (slug);

-- Make slug NOT NULL for future inserts
ALTER TABLE portfolios 
ALTER COLUMN slug SET NOT NULL;

-- Drop the temporary function
DROP FUNCTION generate_portfolio_slug(UUID); 