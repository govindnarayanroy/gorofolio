#!/usr/bin/env node

/**
 * Setup Supabase Storage for GoRoFolio
 * This script ensures the profile-images bucket exists and is properly configured
 */

const { createClient } = require('@supabase/supabase-js')

async function setupSupabaseStorage() {
  console.log('🔧 Setting up Supabase Storage...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables')
    console.log('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
    process.exit(1)
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    // List existing buckets
    console.log('📋 Checking existing buckets...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError)
      process.exit(1)
    }
    
    console.log('📦 Existing buckets:', buckets?.map(b => b.name) || [])
    
    // Check if profile-images bucket exists
    const bucketExists = buckets?.some(bucket => bucket.name === 'profile-images')
    
    if (bucketExists) {
      console.log('✅ Bucket profile-images already exists')
    } else {
      // Create the bucket
      console.log('🔧 Creating profile-images bucket...')
      const { data: createData, error: createError } = await supabase.storage.createBucket('profile-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        fileSizeLimit: 5 * 1024 * 1024 // 5MB
      })
      
      if (createError) {
        console.error('❌ Error creating bucket:', createError)
        process.exit(1)
      }
      
      console.log('✅ Bucket created successfully:', createData)
    }
    
    // Test upload functionality
    console.log('🧪 Testing upload functionality...')
    const testFile = Buffer.from('test image content')
    const testPath = 'test-upload.txt'
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(testPath, testFile, {
        contentType: 'text/plain',
        upsert: true
      })
    
    if (uploadError) {
      console.error('❌ Test upload failed:', uploadError)
      process.exit(1)
    }
    
    console.log('✅ Test upload successful')
    
    // Get public URL
    const { data: urlData } = supabase.storage.from('profile-images').getPublicUrl(testPath)
    console.log('🔗 Test file URL:', urlData.publicUrl)
    
    // Clean up test file
    const { error: deleteError } = await supabase.storage
      .from('profile-images')
      .remove([testPath])
    
    if (deleteError) {
      console.log('⚠️ Warning: Could not delete test file:', deleteError)
    } else {
      console.log('🧹 Test file cleaned up')
    }
    
    console.log('🎉 Supabase Storage setup complete!')
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

// Run the setup
setupSupabaseStorage() 