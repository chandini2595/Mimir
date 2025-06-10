import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest, { params }: { params: { filename: string } }) {
  const filename = decodeURIComponent(params.filename)

  // Serve from local if in dev mode
  if (process.env.NEXT_PUBLIC_LOCAL_DEV === 'true') {
    // Support subfolders (e.g., folder/page-1.pdf)
    const localPath = path.join(process.cwd(), '../../backend/local_uploads', filename)
    if (!fs.existsSync(localPath)) {
      return new Response('File not found', { status: 404 })
    }
    const buffer = fs.readFileSync(localPath)
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    })
  }

  const githubRawUrl = `https://raw.githubusercontent.com/RamachandraKulkarni/mimir-docs-storage/main/${filename}`

  const fileResponse = await fetch(githubRawUrl)

  if (!fileResponse.ok) {
    return new Response('File not found', { status: fileResponse.status })
  }

  const buffer = await fileResponse.arrayBuffer()

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
    },
  })
}
