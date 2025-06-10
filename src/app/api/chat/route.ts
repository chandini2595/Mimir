import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const message = formData.get('message') as string

    if (!file || !message) {
      return NextResponse.json({ error: 'Missing file or message' }, { status: 400 })
    }

    // Upload file to GitHub or external storage (optional, can be added here)

    const fileNote = `A PDF named "${file.name}" has been uploaded. Use this context while answering.`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-maverick:free',
        messages: [
          { role: 'system', content: fileNote },
          { role: 'user', content: message },
        ],
      }),
    })

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content ?? 'No response from model.'

    return NextResponse.json({ response: reply })
  } catch (err: any) {
    console.error('❌ LLM Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
