import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateAssistantResponse } from '../../../lib/assistant/receptionist';
import { catalogRepository } from '../../../lib/db/repository';

const assistantQuerySchema = z.object({
  message: z.string().min(1).max(500),
  category: z.string().optional(),
  maxBudget: z.number().positive().optional(),
  productType: z.enum(['physical', 'digital']).optional(),
  preferredMerchant: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = assistantQuerySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid assistant parameters', details: validated.error.format() },
        { status: 400 }
      );
    }

    const { message, category, maxBudget, productType, preferredMerchant } = validated.data;
    const response = generateAssistantResponse({
      userMessage: message,
      category,
      maxBudget,
      productType,
      preferredMerchant
    });

    // Log conversation to catalog repository for owner admin dashboard
    const productIds = response.recommendations?.map(r => r.product.id) || [];
    catalogRepository.logAssistantConversation(
      `sess_${Date.now()}`,
      message,
      response.content,
      productIds
    );

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: 'Failed to process assistant recommendation' },
      { status: 500 }
    );
  }
}
