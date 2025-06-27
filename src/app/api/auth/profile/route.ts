import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const authorization = req.headers.get('authorization');
  const res = await fetch(`${process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://your-backend-api.vercel.app'}/api/auth/profile`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      ...(authorization && { 'Authorization': authorization })
    },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
