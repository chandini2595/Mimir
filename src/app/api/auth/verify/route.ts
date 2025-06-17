import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  
  const res = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/local/verify`, {
    method: 'GET',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json' 
    },
  });
  
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
