import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, "_");
    const filename = `${timestamp}_${originalName}`;
    
    // Directory path: public/gallery
    const dirPath = join(process.cwd(), "public", "gallery");
    
    // Check if directory exists, if not create it
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }

    const filepath = join(dirPath, filename);

    // Write file to filesystem
    await writeFile(filepath, buffer);

    // Return the URL path
    const url = `/gallery/${filename}`;

    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Failed to upload file" }, { status: 500 });
  }
}
