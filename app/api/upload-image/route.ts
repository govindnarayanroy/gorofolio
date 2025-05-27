import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const USE_SUPABASE_STORAGE = process.env.USE_SUPABASE_STORAGE === 'true';

export async function POST(req: Request) {
  try {
    console.log("📥 Image upload API called");
    console.log("🔧 Storage mode:", USE_SUPABASE_STORAGE ? "Supabase Storage" : "Local Storage");
    
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log("❌ Authentication failed");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const form = await req.formData();
    const file = form.get("image") as File;

    console.log("📁 File details:", {
      exists: !!file,
      name: file?.name,
      size: file?.size,
      type: file?.type,
    });

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    console.log("✅ File validation passed");

    let imageUrl: string;

    if (USE_SUPABASE_STORAGE) {
      // Supabase Storage implementation
      try {
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const fileName = `${user.id}-${timestamp}.${extension}`;
        const filePath = `profile-images/${fileName}`;
        
        console.log("📤 Uploading to Supabase Storage:", filePath);
        
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(filePath, buffer, {
            contentType: file.type,
            upsert: true
          });

        if (uploadError) {
          console.error("❌ Supabase upload error:", uploadError);
          throw new Error(`Supabase upload failed: ${uploadError.message}`);
        }

        console.log("✅ Supabase upload successful:", uploadData);

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
        console.log("🔗 Supabase public URL:", imageUrl);

      } catch (supabaseError) {
        console.error("❌ Supabase Storage error, falling back to local storage:", supabaseError);
        
        // Fallback to local storage
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const fileName = `${user.id}-${timestamp}.${extension}`;
        
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile-images');
        await mkdir(uploadDir, { recursive: true });
        
        const filePath = path.join(uploadDir, fileName);
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        await writeFile(filePath, buffer);
        console.log("💾 File saved locally (fallback):", filePath);

        imageUrl = `/uploads/profile-images/${fileName}`;
        console.log("�� Local public URL (fallback):", imageUrl);
      }
    } else {
      // Local storage implementation
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const fileName = `${user.id}-${timestamp}.${extension}`;
      
      // Ensure upload directory exists
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile-images');
      await mkdir(uploadDir, { recursive: true });
      
      // Save file locally
      const filePath = path.join(uploadDir, fileName);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      await writeFile(filePath, buffer);
      console.log("💾 File saved locally:", filePath);

      // Create public URL
      imageUrl = `/uploads/profile-images/${fileName}`;
      console.log("🔗 Local public URL:", imageUrl);
    }

    // Update user's resume with image URL
    const { error: updateError } = await supabase
      .from("resumes")
      .update({ image_url: imageUrl })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("❌ Database update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    console.log("✅ Database updated successfully");

    return NextResponse.json({
      success: true,
      imageUrl,
      message: "Image uploaded successfully",
      storage: USE_SUPABASE_STORAGE ? "supabase" : "local"
    });

  } catch (error) {
    console.error("❌ Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 