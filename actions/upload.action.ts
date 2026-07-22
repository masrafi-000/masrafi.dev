"use server";

import { uploadImage, uploadDocument, uploadFile, deleteFileFromR2 } from "@/utils/image";
import type { ActionResponse } from "./project.action";

/**
 * Process image inputs: Handles File objects, Data URIs (base64), or existing URLs.
 * Uploads File objects or Base64 data to Cloudflare R2 bucket and returns the public access URL.
 */
export async function processImageInput(
  input: unknown,
  folder: string = "projects"
): Promise<string | null> {
  if (!input) return null;

  // 1. If it's a browser File object
  if (typeof File !== "undefined" && input instanceof File && input.size > 0) {
    return await uploadImage(input, folder);
  }

  // Handle plain object mimicking File (e.g. from FormData)
  if (
    typeof input === "object" &&
    input !== null &&
    "arrayBuffer" in input &&
    typeof (input as any).arrayBuffer === "function"
  ) {
    try {
      const buffer = Buffer.from(await (input as any).arrayBuffer());
      const name = (input as any).name || `upload-${Date.now()}`;
      const type = (input as any).type || "image/png";
      const file = new File([buffer], name, { type });
      return await uploadImage(file, folder);
    } catch {
      // fallback
    }
  }

  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) return null;

    // 2. If it's a base64 / Data URI
    if (trimmed.startsWith("data:")) {
      const matches = trimmed.match(/^data:(image\/[a-zA-Z0-9+\-+.]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, "base64");
        const file = new File([buffer], `upload-${Date.now()}`, { type: mimeType });
        return await uploadImage(file, folder);
      }
    }

    // 3. Existing URL
    return trimmed;
  }

  return null;
}

/**
 * Direct Server Action to upload a file (image, PDF, doc) to Cloudflare R2
 * Returns the public access URL for database storage.
 */
export async function uploadProjectFileAction(
  formData: FormData
): Promise<ActionResponse<{ url: string }>> {
  try {
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "projects";

    if (!file || !(file instanceof File) || file.size === 0) {
      return { success: false, error: "Please select a valid file to upload." };
    }

    const url = await uploadFile(file, folder);

    return {
      success: true,
      data: { url },
      message: "File uploaded to Cloudflare R2 successfully!",
    };
  } catch (error) {
    console.error("[uploadProjectFileAction Error]:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload file to Cloudflare R2.",
    };
  }
}

/**
 * Direct Server Action to upload an image to Cloudflare R2 (with WebP optimization)
 */
export async function uploadImageAction(
  formData: FormData
): Promise<ActionResponse<{ url: string }>> {
  try {
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "projects";

    if (!file || !(file instanceof File) || file.size === 0) {
      return { success: false, error: "Please select a valid image file." };
    }

    const url = await uploadImage(file, folder);

    return {
      success: true,
      data: { url },
      message: "Image uploaded successfully!",
    };
  } catch (error) {
    console.error("[uploadImageAction Error]:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload image.",
    };
  }
}

/**
 * Direct Server Action to upload a document (PDF, DOCX, TXT) to Cloudflare R2
 */
export async function uploadDocumentAction(
  formData: FormData
): Promise<ActionResponse<{ url: string }>> {
  try {
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "documents";

    if (!file || !(file instanceof File) || file.size === 0) {
      return { success: false, error: "Please select a valid document file." };
    }

    const url = await uploadDocument(file, folder);

    return {
      success: true,
      data: { url },
      message: "Document uploaded successfully!",
    };
  } catch (error) {
    console.error("[uploadDocumentAction Error]:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload document.",
    };
  }
}
