#!/usr/bin/env node

/**
 * Simple Supabase Storage Bucket Setup
 * Uses anon key to create the profile-images bucket
 */

const { createClient } = require('@supabase/supabase-js')

async function setupBucket() {
  console.log('🔧 Setting up Supabase Storage bucket...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables')
    console.log('Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY')
    process.exit(1)
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    // List existing buckets
    console.log('📋 Checking existing buckets...')
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.log('❌ Error listing buckets:', listError)
      console.log('ℹ️  This might be expected if you need service role permissions')
    } else {
      console.log('📦 Existing buckets:', buckets?.map(b => b.name) || [])
    }
    
    // Try to create the bucket
    console.log('🔧 Attempting to create profile-images bucket...')
    const { data: createData, error: createError } = await supabase.storage.createBucket('profile-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      fileSizeLimit: 5 * 1024 * 1024 // 5MB
    })
    
    if (createError) {
      console.log('❌ Error creating bucket:', createError)
      console.log('ℹ️  You may need to create this bucket manually in the Supabase dashboard')
      console.log('ℹ️  Go to: Storage > Create new bucket > Name: profile-images > Public: true')
    } else {
      console.log('✅ Bucket created successfully:', createData)
    }
    
    // Test if we can access the bucket now
    console.log('🧪 Testing bucket access...')
    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('profile-images')
    
    if (bucketError) {
      console.log('❌ Cannot access bucket:', bucketError)
    } else {
      console.log('✅ Bucket accessible:', bucketData)
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
  }
}

// Run the setup
setupBucket() 