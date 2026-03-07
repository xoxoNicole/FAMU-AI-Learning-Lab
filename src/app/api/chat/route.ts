
import { NextRequest, NextResponse } from 'next/server';
import { askNicole } from '@/ai/flows/nicole-mentorship';

/**
 * Backend API for Digital Nicole Chat.
 * This route wraps the Genkit Mentorship flow to provide a standard REST endpoint.
 */
export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Call the grounded Genkit flow
    const response = await askNicole({ userQuery: query });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Digital Nicole API Error:', error);
    return NextResponse.json(
      { error: 'Nicole is temporarily unavailable. Let\'s take a deep breath and try again.' },
      { status: 500 }
    );
  }
}
