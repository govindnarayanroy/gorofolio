# Supabase Storage Setup Guide - Profile Images Bucket

## Current Issue
✅ **Bucket Exists**: `profile-images` bucket is created  
❌ **RLS Policy Missing**: Row Level Security is blocking uploads  
❌ **Error**: `new row violates row-level security policy`

## Solution: Configure RLS Policies

### Option 1: Using Supabase Dashboard (Recommended)

1. **Go to Storage Policies**:
   - Navigate to: https://supabase.com/dashboard/project/fnscwhlyxjlopnbrnepv/storage/policies
   - Or: Dashboard → Storage → Policies

2. **Create Upload Policy**:
   ```sql
   -- Policy Name: "Allow authenticated users to upload profile images"
   -- Operation: INSERT
   -- Target: profile-images bucket
   
   CREATE POLICY "Allow authenticated users to upload profile images"
   ON storage.objects
   FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'profile-images');
   ```

3. **Create Read Policy**:
   ```sql
   -- Policy Name: "Allow public read access to profile images"
   -- Operation: SELECT
   -- Target: profile-images bucket
   
   CREATE POLICY "Allow public read access to profile images"
   ON storage.objects
   FOR SELECT
   TO public
   USING (bucket_id = 'profile-images');
   ```

4. **Create Update Policy** (Optional):
   ```sql
   -- Policy Name: "Allow users to update their own profile images"
   -- Operation: UPDATE
   -- Target: profile-images bucket
   
   CREATE POLICY "Allow users to update their own profile images"
   ON storage.objects
   FOR UPDATE
   TO authenticated
   USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

5. **Create Delete Policy** (Optional):
   ```sql
   -- Policy Name: "Allow users to delete their own profile images"
   -- Operation: DELETE
   -- Target: profile-images bucket
   
   CREATE POLICY "Allow users to delete their own profile images"
   ON storage.objects
   FOR DELETE
   TO authenticated
   USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

### Option 2: Using SQL Editor

1. **Go to SQL Editor**:
   - Navigate to: https://supabase.com/dashboard/project/fnscwhlyxjlopnbrnepv/sql
   - Or: Dashboard → SQL Editor

2. **Run this SQL**:
   ```sql
   -- Enable RLS on storage.objects (should already be enabled)
   ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
   
   -- Create policies for profile-images bucket
   CREATE POLICY "Allow authenticated users to upload profile images"
   ON storage.objects
   FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'profile-images');
   
   CREATE POLICY "Allow public read access to profile images"
   ON storage.objects
   FOR SELECT
   TO public
   USING (bucket_id = 'profile-images');
   
   CREATE POLICY "Allow users to update their own profile images"
   ON storage.objects
   FOR UPDATE
   TO authenticated
   USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);
   
   CREATE POLICY "Allow users to delete their own profile images"
   ON storage.objects
   FOR DELETE
   TO authenticated
   USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

### Option 3: Disable RLS (Not Recommended for Production)

If you want to quickly test without RLS:
```sql
-- ONLY FOR TESTING - NOT RECOMMENDED FOR PRODUCTION
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

## Testing After Setup

After creating the policies, test the upload:

```bash
node scripts/test-bucket-upload.js
```

Expected output:
```
✅ Upload successful
🔗 Public URL: https://fnscwhlyxjlopnbrnepv.supabase.co/storage/v1/object/public/profile-images/test-xxxxx.txt
✅ Test file cleaned up
🎉 Bucket test successful! The profile-images bucket is working.
```

## Current Environment Variables

✅ All required environment variables are configured:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_ACCESS_TOKEN` (for MCP)

## Production Deployment

Once the policies are set up:
1. The image upload will work in both development and production
2. Local development uses local storage as fallback
3. Production (Vercel) will use Supabase Storage

## Next Steps

1. **Create the RLS policies** using Option 1 or 2 above
2. **Test the upload** using the test script
3. **Deploy to production** once local testing passes
4. **Test production image upload** on the live site

---

**Note**: The bucket `profile-images` already exists. You only need to add the RLS policies to allow uploads. 