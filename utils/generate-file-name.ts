import crypto from "crypto";

/**
 * Generates a unique filename with timestamp and random UUID.
 */
export function generateFileName(ext: string): string {
  const cleanExt = ext.startsWith(".") ? ext.slice(1) : ext;
  return `${Date.now()}-${crypto.randomUUID()}.${cleanExt}`;
}

/**
 * Extracts file extension from a filename or MIME type.
 */
export function getExtension(filenameOrMime: string): string {
  if (filenameOrMime.includes("/")) {
    const mimeMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
      "image/avif": "avif",
      "image/svg+xml": "svg",
      "application/pdf": "pdf",
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "application/vnd.ms-excel": "xls",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
      "application/vnd.ms-powerpoint": "ppt",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
      "text/plain": "txt",
      "text/csv": "csv",
    };

    if (mimeMap[filenameOrMime]) {
      return mimeMap[filenameOrMime];
    }
  }

  const parts = filenameOrMime.split(".");
  if (parts.length > 1) {
    return parts.pop()!.toLowerCase().split("?")[0].split("#")[0];
  }

  return "bin";
}