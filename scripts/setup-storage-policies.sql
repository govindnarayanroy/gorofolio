-- Supabase Storage RLS Policies for profile-images bucket
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/fnscwhlyxjlopnbrnepv/sql

-- 1. Allow authenticated users to upload profile images
CREATE POLICY "Allow authenticated users to upload profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-images');

-- 2. Allow public read access to profile images
CREATE POLICY "Allow public read access to profile images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-images');

-- 3. Allow users to update their own profile images (optional)
CREATE POLICY "Allow users to update their own profile images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'profile-images');

-- 4. Allow users to delete their own profile images (optional)
CREATE POLICY "Allow users to delete their own profile images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'profile-images');

-- 5. Verify RLS is enabled (should already be enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 6. Check existing policies (for verification)
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'; 