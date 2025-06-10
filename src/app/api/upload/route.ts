import { NextRequest, NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN })
const REPO = 'mimir-docs-storage'
const OWNER = 'RamachandraKulkarni'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const content = buffer.toString('base64')
    const filename = `${Date.now()}-${file.name}`

    // 1. Upload to GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: filename,
      message: `upload: ${filename}`,
      content,
      committer: {
        name: 'Mimir Bot',
        email: 'mimir@example.com',
      },
      author: {
        name: 'Mimir Bot',
        email: 'mimir@example.com',
      },
    })

    // 2. Parse PDF
    // const parsed = await pdfParse(buffer)

    // const metadata = {
    //   title: parsed.info?.Title || 'Unknown',
    //   author: parsed.info?.Author || 'Unknown',
    //   subject: parsed.info?.Subject || 'Unknown',
    //   creator: parsed.info?.Creator || 'Unknown',
    //   keywords: parsed.info?.Keywords || 'None',
    // }

    // const pages = parsed.text
    //   .split(/\f/)
    //   .map((page: string, idx: number): { page: number; content: string } => ({
    //     page: idx + 1,
    //     content: page.trim(),
    //   }))

    // 3. Respond to frontend
    return NextResponse.json({
      success: true,
      filename,
      download_url: `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/${encodeURIComponent(filename)}`,
      // parsed: {
      //   metadata,
      //   pages,
      // },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
