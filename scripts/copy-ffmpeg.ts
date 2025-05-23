import fs from "fs/promises";
import path from "path";

async function copyFFmpegFiles() {
  const sourceDir = path.join(
    process.cwd(),
    "node_modules",
    ".pnpm",
    "@ffmpeg+core@0.12.10",
    "node_modules",
    "@ffmpeg",
    "core",
    "dist",
    "umd"
  );
  const targetDir = path.join(process.cwd(), "public", "ffmpeg");

  try {
    // Create target directory if it doesn't exist
    await fs.mkdir(targetDir, { recursive: true });

    // Copy core files
    const files = ["ffmpeg-core.js", "ffmpeg-core.wasm"];
    for (const file of files) {
      const sourcePath = path.join(sourceDir, file);
      const targetPath = path.join(targetDir, file);
      await fs.copyFile(sourcePath, targetPath);
      console.log(`Copied ${file} to public/ffmpeg/`);
    }
  } catch (err) {
    console.error("Error copying FFmpeg files:", err);
    process.exit(1);
  }
}

copyFFmpegFiles(); 