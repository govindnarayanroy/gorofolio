#!/usr/bin/env node

/**
 * Test Supabase Storage Bucket Upload
 * Tests if the profile-images bucket is working by attempting a test upload
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

async function testBucketUpload() {
  console.log('🧪 Testing Supabase Storage bucket upload...')
  
  // Load environment variables from .env.local
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const envLines = envContent.split('\n')
    
    for (const line of envLines) {
      if (line.trim() && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=')
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim()
        }
      }
    }
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables')
    console.log('Required: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY')
    process.exit(1)
  }
  
  console.log('✅ Environment variables loaded')
  console.log('🔗 Supabase URL:', supabaseUrl)
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    // Create a test file buffer
    const testContent = 'This is a test file for bucket verification'
    const testBuffer = Buffer.from(testContent, 'utf8')
    const testFileName = `test-${Date.now()}.txt`
    
    console.log('📤 Attempting to upload test file:', testFileName)
    
    // Try to upload to the bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-images')
      .upload(testFileName, testBuffer, {
        contentType: 'text/plain',
        upsert: true,
      })
    
    if (uploadError) {
      console.log('❌ Upload failed:', uploadError)
      console.log('📋 Error details:', {
        message: uploadError.message,
        statusCode: uploadError.statusCode,
        error: uploadError.error
      })
      
      if (uploadError.statusCode === 404) {
        console.log('💡 This suggests the bucket does not exist or is not accessible')
      } else if (uploadError.statusCode === 403) {
        console.log('💡 This suggests permission issues - bucket exists but access denied')
      }
      
      return false
    }
    
    console.log('✅ Upload successful:', uploadData)
    
    // Try to get public URL
    const { data: urlData } = supabase.storage.from('profile-images').getPublicUrl(testFileName)
    console.log('🔗 Public URL:', urlData.publicUrl)
    
    // Clean up - delete the test file
    console.log('🧹 Cleaning up test file...')
    const { error: deleteError } = await supabase.storage
      .from('profile-images')
      .remove([testFileName])
    
    if (deleteError) {
      console.log('⚠️ Failed to delete test file:', deleteError)
    } else {
      console.log('✅ Test file cleaned up')
    }
    
    console.log('🎉 Bucket test successful! The profile-images bucket is working.')
    return true
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    return false
  }
}

// Run the test
testBucketUpload().then(success => {
  process.exit(success ? 0 : 1)
}) 