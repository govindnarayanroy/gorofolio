import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    console.log('🔧 Fixing image URL...')

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

    // Get current resume data
    const { data: resume, error: fetchError } = await supabase
      .from('resumes')
      .select('image_url')
      .eq('user_id', user.id)
      .single()

    if (fetchError || !resume) {
      console.log('❌ Failed to fetch resume:', fetchError)
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    const currentImageUrl = resume.image_url
    console.log('📷 Current image URL:', currentImageUrl)

    if (!currentImageUrl || !currentImageUrl.includes('profile-images')) {
      return NextResponse.json({ error: 'No Supabase image URL found' }, { status: 400 })
    }

    // Extract file path from the current URL
    // URL format: https://fnscwhlyxjlopnbrnepv.supabase.co/storage/v1/object/public/profile-images/profile-images/filename
    const urlParts = currentImageUrl.split('/profile-images/')
    if (urlParts.length < 2) {
      return NextResponse.json({ error: 'Invalid image URL format' }, { status: 400 })
    }

    // The file path should be just the filename (without the double profile-images)
    const fileName = urlParts[urlParts.length - 1].split('?')[0] // Remove any query params
    console.log('📁 Extracted filename:', fileName)

    // Generate new signed URL
    const { data: urlData, error: urlError } = await supabase.storage
      .from('profile-images')
      .createSignedUrl(fileName, 365 * 24 * 60 * 60) // 1 year expiry

    if (urlError) {
      console.error('❌ Failed to create signed URL:', urlError)
      return NextResponse.json({ 
        error: 'Failed to create signed URL',
        details: urlError.message 
      }, { status: 500 })
    }

    const newImageUrl = urlData.signedUrl
    console.log('🔗 New signed URL:', newImageUrl)

    // Update the database with the new signed URL
    const { error: updateError } = await supabase
      .from('resumes')
      .update({ image_url: newImageUrl })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('❌ Database update error:', updateError)
      return NextResponse.json({ error: 'Failed to update image URL' }, { status: 500 })
    }

    console.log('✅ Image URL fixed successfully')

    return NextResponse.json({
      success: true,
      oldUrl: currentImageUrl,
      newUrl: newImageUrl,
      message: 'Image URL fixed successfully'
    })

  } catch (error) {
    console.error('❌ Fix image URL error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 