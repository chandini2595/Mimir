# Mimir Chat UI (Frontend)

A modern web interface for Retrieval-Augmented Generation (RAG) document chat. Upload documents, preview pages, and chat with your files using a powerful, responsive Next.js 14 + Tailwind CSS frontend.

---

## Features

- **Multi-file Upload & Preview**: Drag-and-drop or pick images, Word, or PDF files. Preview and zoom in on any page.
- **Collapsible Preview Window**: View the page/image referenced by the AI, with zoom and navigation controls.
- **Dedicated Chat Window**: Real-time conversation with markdown rendering, follow-up, and copy answer.
- **Collapsible Sidebar**: Chat history, file tree, and quick actions.
- **Stacked Deck UI**: Switch between multiple files with a beautiful card deck and list view.
- **Responsive Layout**: Works on desktop and mobile, with keyboard shortcuts.
- **Role-based UI**: (Planned) User/Admin features.

---

## Requirements

This frontend requires a compatible backend and AWS services:

- **Backend API**: Node.js/Express server with endpoints for file upload, chat, authentication, and admin (see PRD).
- **AWS S3**: For file storage. [AWS S3 Console](https://s3.console.aws.amazon.com/s3/)
- **AWS Textract**: For server-side text extraction. [AWS Textract Console](https://console.aws.amazon.com/textract/)
- **AWS Bedrock**: For LLM-powered Q&A. [AWS Bedrock Console](https://console.aws.amazon.com/bedrock/)
- **AWS CloudWatch**: For monitoring and metrics. [AWS CloudWatch Console](https://console.aws.amazon.com/cloudwatch/)
- **Authentication**: JWT-based, with user and admin roles.

You must configure the frontend to point to your backend API (see `.env` or `NEXT_PUBLIC_BACKEND_URL`).

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
2. **Set backend API URL:**
   - Copy the example environment file:
     ```bash
     cp .env.example .env.local
     ```
   - Edit `.env.local` and update the values:
     ```env
     BACKEND_URL=http://localhost:5000
     NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
     NEXT_PUBLIC_LOCAL_DEV=true
     OPENROUTER_API_KEY=your_openrouter_api_key
     GITHUB_TOKEN=your_github_token
     ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Open** [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

- `src/app/` — Main Next.js app, routes, and API handlers
- `src/components/` — UI components (Chat, Sidebar, FileUploader, PDFViewer, etc.)
- `public/` — Static assets and PDF worker
- `types/` — TypeScript type definitions

---

## Vercel Deployment

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/mimir-chat-ui)

### Manual Deployment

1. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings in Vercel
   - Add these environment variables:
     ```
     BACKEND_URL=https://your-backend-api.vercel.app
     NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.vercel.app
     NEXT_PUBLIC_LOCAL_DEV=false
     OPENROUTER_API_KEY=your_openrouter_api_key
     GITHUB_TOKEN=your_github_token
     ```

3. **Deploy your backend first** (if not already deployed)

4. **Update the BACKEND_URL** with your actual backend URL

### Environment Variables Reference
- `BACKEND_URL`: Your backend API URL (server-side)
- `NEXT_PUBLIC_BACKEND_URL`: Your backend API URL (client-side fallback)
- `NEXT_PUBLIC_LOCAL_DEV`: Set to "false" for production
- `OPENROUTER_API_KEY`: API key for LLM chat functionality
- `GITHUB_TOKEN`: GitHub personal access token for file storage

---

## Cloud Integration Checklist

- [ ] Backend API deployed and reachable
- [ ] Environment variables set in Vercel dashboard
- [ ] OPENROUTER_API_KEY configured
- [ ] GITHUB_TOKEN configured with repo permissions
- [ ] AWS S3 bucket created and accessible (optional)
- [ ] AWS Textract enabled (optional)
- [ ] AWS Bedrock access (optional)

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [AWS S3](https://s3.console.aws.amazon.com/s3/)
- [AWS Textract](https://console.aws.amazon.com/textract/)
- [AWS Bedrock](https://console.aws.amazon.com/bedrock/)
- [AWS CloudWatch](https://console.aws.amazon.com/cloudwatch/)

---
