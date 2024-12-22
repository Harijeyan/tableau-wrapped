import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: Request) {
  try {
    const { event, username } = await request.json();
    
    // Increment total downloads
    await kv.incr('total_downloads');
    
    // Add to user downloads list
    await kv.lpush('recent_downloads', {
      username,
      timestamp: Date.now()
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
  }
} 