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
   - Create a `.env.local` file:
     ```env
     NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
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

## Cloud Integration Checklist

- [ ] AWS S3 bucket created and accessible
- [ ] AWS Textract enabled
- [ ] AWS Bedrock access (for LLM)
- [ ] Backend API deployed and reachable
- [ ] Environment variables set for API URL

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [AWS S3](https://s3.console.aws.amazon.com/s3/)
- [AWS Textract](https://console.aws.amazon.com/textract/)
- [AWS Bedrock](https://console.aws.amazon.com/bedrock/)
- [AWS CloudWatch](https://console.aws.amazon.com/cloudwatch/)

---
