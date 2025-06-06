import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
// Use Supabase Storage by default in production, local storage only in development
const USE_SUPABASE_STORAGE = process.env.NODE_ENV === 'production' || process.env.USE_SUPABASE_STORAGE === 'true'

// Simplified bucket check - just assume bucket exists since we know it does
async function ensureBucketExists(supabase: any) {
  try {
    // Try a simple operation to test if we can access the bucket
    const { data, error } = await supabase.storage
      .from('profile-images')
      .list('', { limit: 1 })
    
    if (error) {
      console.log('⚠️ Cannot list bucket contents (this is expected with RLS), but bucket likely exists:', error.message)
      // Even if we can't list, the bucket probably exists, so return true
      return true
    }

    console.log('✅ Bucket profile-images is accessible')
    return true
  } catch (error) {
    console.log('⚠️ Bucket access test failed, but proceeding anyway:', error)
    // Assume bucket exists and proceed
    return true
  }
}

export async function POST(req: Request) {
  try {
    console.log('📥 Image upload API called')
    console.log('🔧 Storage mode:', USE_SUPABASE_STORAGE ? 'Supabase Storage' : 'Local Storage')
    console.log('🌍 Environment:', process.env.NODE_ENV)

    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log('❌ Authentication failed:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const form = await req.formData()
    const file = form.get('image') as File

    console.log('📁 File details:', {
      exists: !!file,
      name: file?.name,
      size: file?.size,
      type: file?.type,
    })

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
    }

    console.log('✅ File validation passed')

    let imageUrl: string

    if (USE_SUPABASE_STORAGE) {
      // Supabase Storage implementation (primary for production)
      try {
        // Ensure bucket exists
        const bucketReady = await ensureBucketExists(supabase)
        
        if (!bucketReady) {
          throw new Error('Failed to setup Supabase Storage bucket')
        }

        const timestamp = Date.now()
        const extension = file.name.split('.').pop()
        const fileName = `${user.id}-${timestamp}.${extension}`
        const filePath = `${fileName}` // Store directly in bucket root

        console.log('📤 Uploading to Supabase Storage:', filePath)

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(filePath, buffer, {
            contentType: file.type,
            upsert: true,
          })

        if (uploadError) {
          console.error('❌ Supabase upload error:', uploadError)
          throw new Error(`Supabase upload failed: ${uploadError.message}`)
        }

        console.log('✅ Supabase upload successful:', uploadData)

        // Get signed URL (valid for 1 year)
        const { data: urlData, error: urlError } = await supabase.storage
          .from('profile-images')
          .createSignedUrl(filePath, 365 * 24 * 60 * 60) // 1 year expiry

        if (urlError) {
          console.error('❌ Failed to create signed URL:', urlError)
          throw new Error(`Failed to create signed URL: ${urlError.message}`)
        }

        imageUrl = urlData.signedUrl
        console.log('🔗 Supabase signed URL:', imageUrl)
      } catch (supabaseError) {
        console.error('❌ Supabase Storage error:', supabaseError)
        
        // In production, we can't fall back to local storage, so return error
        if (process.env.NODE_ENV === 'production') {
          return NextResponse.json(
            { 
              error: 'Failed to upload image. Please try again.',
              details: supabaseError instanceof Error ? supabaseError.message : 'Unknown error'
            },
            { status: 500 }
          )
        }

        // Fallback to local storage only in development
        console.log('🔄 Falling back to local storage (development only)')
        const timestamp = Date.now()
        const extension = file.name.split('.').pop()
        const fileName = `${user.id}-${timestamp}.${extension}`

        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile-images')
        await mkdir(uploadDir, { recursive: true })

        const filePath = path.join(uploadDir, fileName)
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        await writeFile(filePath, buffer)
        console.log('💾 File saved locally (fallback):', filePath)

        imageUrl = `/uploads/profile-images/${fileName}`
        console.log('🔗 Local public URL (fallback):', imageUrl)
      }
    } else {
      // Local storage implementation (development only)
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Local storage not available in production' },
          { status: 500 }
        )
      }

      const timestamp = Date.now()
      const extension = file.name.split('.').pop()
      const fileName = `${user.id}-${timestamp}.${extension}`

      // Ensure upload directory exists
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile-images')
      await mkdir(uploadDir, { recursive: true })

      // Save file locally
      const filePath = path.join(uploadDir, fileName)
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      await writeFile(filePath, buffer)
      console.log('💾 File saved locally:', filePath)

      // Create public URL
      imageUrl = `/uploads/profile-images/${fileName}`
      console.log('🔗 Local public URL:', imageUrl)
    }

    // Update user's resume with image URL
    const { error: updateError } = await supabase
      .from('resumes')
      .update({ image_url: imageUrl })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('❌ Database update error:', updateError)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    console.log('✅ Database updated successfully')

    return NextResponse.json({
      success: true,
      imageUrl,
      message: 'Image uploaded successfully',
      storage: USE_SUPABASE_STORAGE ? 'supabase' : 'local',
    })
  } catch (error) {
    console.error('❌ Upload error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
