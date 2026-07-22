import { S3Client } from "@aws-sdk/client-s3";

const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY || process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_KEY || process.env.R2_SECRET_ACCESS_KEY;

if (!endpoint || !accessKeyId || !secretAccessKey) {
  console.warn(
    "[R2 S3Client Warning]: Cloudflare R2 environment variables (R2_ENDPOINT, R2_ACCESS_KEY, R2_SECRET_KEY) are incomplete or missing."
  );
}

export const r2 = new S3Client({
  region: "auto",
  endpoint: endpoint || "https://dummy.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});