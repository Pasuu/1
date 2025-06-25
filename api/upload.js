import { put } from '@vercel/blob';
import { createReadStream } from 'fs';
import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge', // 使用边缘函数提高性能
};

export default async function upload(request) {
  const formData = await request.formData();
  const file = formData.get('file');
  
  if (!file) {
    return new Response('No file uploaded', { status: 400 });
  }
  
  try {
    const blob = await put(file.name, file.stream(), {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return NextResponse.json({
      url: blob.url,
      downloadUrl: blob.downloadUrl
    });
  } catch (error) {
    return new Response('Upload failed: ' + error.message, { status: 500 });
  }
}