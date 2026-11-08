import { NextRequest, NextResponse } from 'next/server';
import { sanctuaryStore } from '@/lib/supabase/mock-store';

export async function GET() {
  const questions = sanctuaryStore.getQuizQuestions();
  return NextResponse.json({ questions });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, options, correctOptionIndex, explanation, targetPerson } = body;

    if (!question || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json({ error: 'Valid question and options required.' }, { status: 400 });
    }

    const newQuestion = sanctuaryStore.addQuizQuestion({
      question,
      options,
      correctOptionIndex: Number(correctOptionIndex) || 0,
      explanation: explanation || '',
      targetPerson: targetPerson === 'lei' ? 'lei' : 'emman',
    });

    return NextResponse.json({ success: true, question: newQuestion });
  } catch (error) {
    console.error('Quiz question add error:', error);
    return NextResponse.json({ error: 'Failed to create arcade quiz question.' }, { status: 500 });
  }
}
