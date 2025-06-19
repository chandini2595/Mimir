import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const authorization = req.headers.get('authorization');
  
  // Get the form data from the request
  const formData = await req.formData();
  
  // Create a new FormData for the backend request
  const backendFormData = new FormData();
  const file = formData.get('file') as File;
  if (file) {
    backendFormData.append('file', file);
  }
  
  const res = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/upload/preview`, {
    method: 'POST',
    headers: { 
      ...(authorization && { 'Authorization': authorization })
    },
    body: backendFormData,
  });
  
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
