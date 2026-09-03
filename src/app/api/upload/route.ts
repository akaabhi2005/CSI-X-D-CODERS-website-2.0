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
    
    const rawFolder = ((data.get("folder") as string) || (data.get("type") as string) || "gallery").toLowerCase();
    const allowedFolders = ["team", "events", "legacy", "news", "gallery"];
    const subDir = allowedFolders.includes(rawFolder) ? rawFolder : "gallery";

    // Directory path
    const dirPath = join(process.cwd(), "public", subDir);
    
    // Try local filesystem write (for local dev)
    try {
      if (!existsSync(dirPath)) {
        await mkdir(dirPath, { recursive: true });
      }
      const filepath = join(dirPath, filename);
      await writeFile(filepath, buffer);
      return NextResponse.json({ success: true, url: `/${subDir}/${filename}` });
    } catch (diskErr) {
      console.warn("Disk write failed (Serverless/Vercel environment). Falling back to Base64 Data URL:", diskErr);
      const mimeType = file.type || "image/jpeg";
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64}`;
      return NextResponse.json({ success: true, url: dataUrl });
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Failed to upload file" }, { status: 500 });
  }
}
