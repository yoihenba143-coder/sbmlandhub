import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const files = formData.getAll("files") as File[];
        const singleFile = formData.get("file") as File | null;

        const filesToProcess: File[] = [];
        if (files && files.length > 0) {
            filesToProcess.push(...files);
        } else if (singleFile) {
            filesToProcess.push(singleFile);
        }

        if (filesToProcess.length === 0) {
            return NextResponse.json(
                { error: "No file was uploaded." },
                { status: 400 }
            );
        }

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const uploadedFiles: Array<{ url: string; name: string; type: "image" | "video" | "other"; size: number }> = [];

        for (const file of filesToProcess) {
            if (!(file instanceof File)) continue;

            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Clean filename
            const timestamp = Date.now();
            const randomSuffix = Math.floor(Math.random() * 10000);
            const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
            const ext = path.extname(originalName).toLowerCase();
            const filename = `${timestamp}-${randomSuffix}${ext}`;
            const filepath = path.join(uploadDir, filename);

            await writeFile(filepath, buffer);

            const isVideo = [".mp4", ".webm", ".mov", ".m4v", ".ogg", ".mkv"].includes(ext) || file.type.startsWith("video/");
            const isImage = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg"].includes(ext) || file.type.startsWith("image/");

            uploadedFiles.push({
                url: `/uploads/${filename}`,
                name: file.name,
                type: isVideo ? "video" : isImage ? "image" : "other",
                size: file.size,
            });
        }

        return NextResponse.json({
            success: true,
            files: uploadedFiles,
            file: uploadedFiles[0],
            url: uploadedFiles[0]?.url,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Failed to upload file. Please try again." },
            { status: 500 }
        );
    }
}
