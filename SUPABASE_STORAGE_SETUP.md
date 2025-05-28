# Supabase Storage Setup Guide

## Current Issue

The image upload functionality is experiencing Supabase Storage errors:

- **404 Bucket not found**: The `profile-images` bucket doesn't exist
- **403 Unauthorized**: Missing or incorrect RLS policies
- **RLS Policy violations**: Storage access is being blocked

## Solution Overview

This guide provides a complete fix for the Supabase Storage configuration, including:

1. Creating the storage bucket
2. Setting up proper RLS policies
3. Configuring environment variables
4. Testing the setup

## Step 1: Run the SQL Setup

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-storage-setup.sql`
4. Click **Run** to execute all commands

This will:

- Create the `profile-images` bucket with proper configuration
- Set up all necessary RLS policies for authenticated users
- Add the `image_url` column to the `resumes` table
- Verify the setup

## Step 2: Environment Configuration

Add this environment variable to your `.env.local` file:

```bash
# Enable Supabase Storage (set to 'false' to use local storage)
USE_SUPABASE_STORAGE=true
```

## Step 3: Bucket Configuration Details

The setup creates a bucket with these specifications:

- **Name**: `profile-images`
- **Public**: `true` (for easy access to profile images)
- **File Size Limit**: 5MB
- **Allowed MIME Types**: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`

## Step 4: RLS Policies Created

### 1. Public Access (SELECT)

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');
```

- Allows anyone to view/download images from the bucket

### 2. Authenticated Upload (INSERT)

```sql
CREATE POLICY "Authenticated users can upload profile images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = 'profile-images'
);
```

- Only authenticated users can upload
- Files must be in the `profile-images` folder structure

### 3. User-Specific Update (UPDATE)

```sql
CREATE POLICY "Users can update their own profile images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[2]
)
```

- Users can only update their own images
- Based on user ID in the file path

### 4. User-Specific Delete (DELETE)

```sql
CREATE POLICY "Users can delete their own profile images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = 'profile-images' AND
  auth.uid()::text = (storage.foldername(name))[2]
);
```

- Users can only delete their own images

## Step 5: File Path Structure

Images are stored with this path structure:

```
profile-images/{user-id}-{timestamp}.{extension}
```

Example:

```
profile-images/b9895011-7137-4043-8f3b-6e61558dbda9-1748267494158.png
```

## Step 6: API Route Features

The updated upload route (`app/api/upload-image/route.ts`) now supports:

### Dual Storage Mode

- **Supabase Storage**: When `USE_SUPABASE_STORAGE=true`
- **Local Storage**: When `USE_SUPABASE_STORAGE=false` or unset
- **Automatic Fallback**: Falls back to local storage if Supabase fails

### Enhanced Error Handling

- Detailed logging for debugging
- Graceful fallback mechanisms
- Clear error messages

### Response Format

```json
{
  "success": true,
  "imageUrl": "https://your-project.supabase.co/storage/v1/object/public/profile-images/...",
  "message": "Image uploaded successfully",
  "storage": "supabase"
}
```

## Step 7: Testing the Setup

### Test 1: Verify Bucket Creation

Run this query in Supabase SQL Editor:

```sql
SELECT * FROM storage.buckets WHERE id = 'profile-images';
```

### Test 2: Check RLS Policies

```sql
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';
```

### Test 3: Test Upload

1. Start your development server: `npm run dev`
2. Navigate to the editor page
3. Try uploading a profile image
4. Check the console logs for success messages

## Step 8: Troubleshooting

### Common Issues

#### 1. Bucket Still Not Found

- Verify the SQL script ran successfully
- Check for any error messages in the SQL Editor
- Ensure you're using the correct project

#### 2. RLS Policy Errors

- Make sure the user is authenticated
- Check that the JWT token is valid
- Verify the policy conditions match your file structure

#### 3. File Upload Fails

- Check file size (must be < 5MB)
- Verify file type (JPEG, PNG, WebP only)
- Ensure user has valid authentication

### Debug Mode

Set this in your `.env.local` for detailed logging:

```bash
USE_SUPABASE_STORAGE=true
NODE_ENV=development
```

## Step 9: Production Considerations

### Security

- The bucket is set to public for easy access to profile images
- RLS policies ensure users can only modify their own files
- File type and size restrictions are enforced

### Performance

- Public bucket provides better performance for image serving
- CDN caching is automatically enabled
- Images are served directly from Supabase CDN

### Monitoring

- Check Supabase dashboard for storage usage
- Monitor API logs for any errors
- Set up alerts for storage quota limits

## Migration from Local Storage

If you have existing local images, you can migrate them:

1. Set `USE_SUPABASE_STORAGE=false` temporarily
2. Create a migration script to upload existing files
3. Update database records with new URLs
4. Set `USE_SUPABASE_STORAGE=true`
5. Clean up local files

## Status After Setup

✅ **Bucket Created**: `profile-images` bucket with proper configuration  
✅ **RLS Policies**: Complete set of security policies  
✅ **API Route**: Updated with dual storage support  
✅ **Error Handling**: Comprehensive error handling and fallbacks  
✅ **Environment Config**: Flexible storage mode configuration

The image upload functionality should now work correctly with Supabase Storage while maintaining local storage as a reliable fallback option.
