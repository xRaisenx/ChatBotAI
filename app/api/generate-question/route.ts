import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST() {
  try {
    const prompt = `
      Generate a single, concise question (15-30 words) to display as a premade question for a beauty chatbot. The question should encourage users to explore skincare, makeup, product recommendations, beauty advice, or order tracking. Avoid suggesting specific products unless requesting recommendations. Examples:
      - What's the best skincare routine for dry skin?
      - Can you help me track my recent order?
      - What lipsticks match my style?
      Return the response in JSON format: {"question": "..."}
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 50 },
    });

    const question = result.response.text().trim();
    return NextResponse.json({ question });
  } catch (error) {
    console.error('Generate Question API Error:', error);
    return NextResponse.json({ error: 'Failed to generate question' }, { status: 500 });
  }
}
