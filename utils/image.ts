import sharp from "sharp";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { generateFileName, getExtension } from "@/utils/generate-file-name";
import { r2 } from "@/lib/r2";

// Allowed MIME types
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/svg+xml",
];

const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
];

/**
 * Gets normalized R2 public base URL
 */
function getPublicBaseUrl(): string {
  const publicUrl = process.env.R2_PUBLIC_URL || "";
  return publicUrl.replace(/\/$/, "");
}

/**
 * Uploads and optimizes an image file to Cloudflare R2 bucket.
 */
export async function uploadImage(
  file: File,
  folder: string = "projects"
): Promise<string> {
  const bucket = process.env.R2_BUCKET;
  if (!bucket) {
    throw new Error("R2_BUCKET environment variable is not defined.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  let outputBuffer: Buffer;
  let filename: string;
  let contentType: string;

  // Preserve SVG or Animated GIF without sharp re-encoding if desired
  if (file.type === "image/svg+xml") {
    outputBuffer = buffer;
    filename = generateFileName("svg");
    contentType = "image/svg+xml";
  } else {
    // Optimize JPEG, PNG, WEBP, AVIF using Sharp
    outputBuffer = await sharp(buffer)
      .resize({
        width: 1920,
        withoutEnlargement: true,
      })
      .webp({
        quality: 80,
      })
      .toBuffer();

    filename = generateFileName("webp");
    contentType = "image/webp";
  }

  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const key = `${cleanFolder}/${filename}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: outputBuffer,
      ContentType: contentType,
    })
  );

  return `${getPublicBaseUrl()}/${key}`;
}

/**
 * Uploads a document file (PDF, DOCX, DOC, TXT, XLSX, etc.) to Cloudflare R2 bucket.
 */
export async function uploadDocument(
  file: File,
  folder: string = "documents"
): Promise<string> {
  const bucket = process.env.R2_BUCKET;
  if (!bucket) {
    throw new Error("R2_BUCKET environment variable is not defined.");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = getExtension(file.type || file.name);
  const filename = generateFileName(ext);
  const contentType = file.type || "application/octet-stream";

  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const key = `${cleanFolder}/${filename}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `${getPublicBaseUrl()}/${key}`;
}

/**
 * Universal file upload function supporting Images, PDFs, and Documents.
 */
export async function uploadFile(
  file: File,
  folder: string = "uploads"
): Promise<string> {
  if (file.type.startsWith("image/")) {
    return uploadImage(file, folder);
  }

  return uploadDocument(file, folder);
}

/**
 * Deletes a file from Cloudflare R2 bucket given its full URL or R2 Key.
 */
export async function deleteFileFromR2(fileUrlOrKey: string): Promise<boolean> {
  const bucket = process.env.R2_BUCKET;
  if (!bucket) {
    throw new Error("R2_BUCKET environment variable is not defined.");
  }

  try {
    const publicUrl = getPublicBaseUrl();
    let key = fileUrlOrKey;

    if (publicUrl && fileUrlOrKey.startsWith(publicUrl)) {
      key = fileUrlOrKey.replace(`${publicUrl}/`, "");
    }

    await r2.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    );

    return true;
  } catch (error) {
    console.error("[deleteFileFromR2 Error]:", error);
    return false;
  }
}