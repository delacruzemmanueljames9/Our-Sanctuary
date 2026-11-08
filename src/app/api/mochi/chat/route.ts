import { NextRequest, NextResponse } from 'next/server';
import { processMochiChat, MochiMessage } from '@/lib/mochi/provider';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body as { messages: MochiMessage[] };

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required.' }, { status: 400 });
    }

    const response = await processMochiChat(messages);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Mochi chat error:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with Mochi.' },
      { status: 500 }
    );
  }
}
