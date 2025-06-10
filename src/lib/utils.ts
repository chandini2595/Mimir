import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const isLocal = process.env.NEXT_PUBLIC_LOCAL_DEV === "true";

// Helper to get file preview URL
export function getFilePreviewUrl(s3Key: string) {
  if (isLocal) {
    return `/local-files/${s3Key}`;
  }
  // S3 public URL or signed URL logic here for production
  // Example: return `https://<your-s3-bucket>.s3.amazonaws.com/${s3Key}`;
  return `/api/files/${encodeURIComponent(s3Key)}`;
}
