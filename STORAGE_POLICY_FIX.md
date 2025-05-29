# Fix Supabase Storage Policy Error

## Problem
❌ Error: `new row violates row-level security policy`  
❌ Status: 403 Unauthorized when uploading to `profile-images` bucket

## Solution
The `profile-images` bucket exists but lacks RLS policies. Follow these steps:

### Step 1: Go to Supabase SQL Editor
Navigate to: https://supabase.com/dashboard/project/fnscwhlyxjlopnbrnepv/sql

### Step 2: Run This SQL Command
Copy and paste this **exact** SQL code:

```sql
-- Allow authenticated users to upload profile images
CREATE POLICY "Allow authenticated users to upload profile images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-images');

-- Allow public read access to profile images  
CREATE POLICY "Allow public read access to profile images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-images');
```

### Step 3: Test the Fix
After running the SQL, test the upload:

```bash
node scripts/test-bucket-upload.js
```

Expected result:
```
✅ Upload successful
🔗 Public URL: https://fnscwhlyxjlopnbrnepv.supabase.co/storage/v1/object/public/profile-images/test-xxxxx.txt
✅ Test file cleaned up
🎉 Bucket test successful!
```

## Alternative: Quick Fix (Less Secure)
If you want to test quickly without authentication:

```sql
-- Allow anyone to upload (NOT RECOMMENDED FOR PRODUCTION)
CREATE POLICY "Allow public uploads to profile images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'profile-images');
```

## Verification
Check if policies were created:

```sql
SELECT policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage'
AND policyname LIKE '%profile%';
```

---

**Next Steps:**
1. Run the SQL in Supabase Dashboard
2. Test with the script
3. Try image upload in your app
4. Deploy to production 