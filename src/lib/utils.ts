import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const isLocal = process.env.NEXT_PUBLIC_LOCAL_DEV === "true";

export function getFilePreviewUrl(s3Key: string) {
  if (isLocal) {
    return `/local-files/${s3Key}`;
  }
  
  return `/api/files/${encodeURIComponent(s3Key)}`;
}
interface File {
  url: string;
  name: string;
}

export const openPreviewTab = (files: File[]) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Document Preview</title>
        <style>
          body { margin: 0; font-family: sans-serif; background: #0f172a; }
          .container { display: flex; height: 100vh; width: 100vw; gap: 24px; padding: 2vh 0; box-sizing: border-box; justify-content: center; align-items: stretch; }
          .doc-preview { flex: 1 1 0; min-width: 0; max-width: 33vw; display: flex; flex-direction: column; border-radius: 1.5rem; background: rgba(255,255,255,0.10); box-shadow: 0 8px 40px 0 rgba(80,120,255,0.13), 0 2px 12px 0 rgba(0,0,0,0.10); border: 2.5px solid rgba(120,180,255,0.18); backdrop-filter: blur(18px) saturate(1.5); -webkit-backdrop-filter: blur(18px) saturate(1.5); overflow: hidden; }
          .doc-title { font-family: 'Fira Mono', monospace; color: #60a5fa; font-size: 1rem; font-weight: 700; background: rgba(30,41,59,0.85); padding: 0.5rem 1rem; border-bottom: 1.5px solid #a5b4fc33; text-align: center; }
          iframe { flex: 1; border: none; background: #fff; }
        </style>
      </head>
      <body>
        <div class="container">
          ${files.map(file => `
            <div class="doc-preview">
              <div class="doc-title">${file.name}</div>
              <iframe src="${file.url}"></iframe>
            </div>
          `).join('')}
        </div>
      </body>
    </html>
  `;
  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
};