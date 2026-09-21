import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  topic: z.enum(['correction', 'suggestion', 'support', 'partnership', 'other']),
  message: z.string().min(10).max(3000)
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contactSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid form input', issues: validated.error.issues },
        { status: 400 }
      );
    }

    // In a production environment with email provider configured:
    // dispatch to email provider (e.g. Resend, Postmark)
    console.log('[Contact Submission]', validated.data);

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been received by the EveryAge Digital editorial desk.'
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit message' },
      { status: 500 }
    );
  }
}
