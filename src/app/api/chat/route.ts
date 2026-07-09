import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { message, history, articleContext } = await req.json();

    const apiKeys: string[] = [];
    if (process.env.GEMINI_API_KEYS) {
        apiKeys.push(...process.env.GEMINI_API_KEYS.split(',').map(k => k.trim()));
    } else if (process.env.GEMINI_API_KEY) {
        apiKeys.push(process.env.GEMINI_API_KEY.trim());
    }

    if (apiKeys.length === 0) {
      return NextResponse.json({ error: 'No API keys configured' }, { status: 500 });
    }

    // Pick a random key for load balancing
    const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
    const ai = new GoogleGenAI({ apiKey: randomKey });

    const systemPrompt = `You are a highly persuasive, friendly AI Sales Assistant for the website ReviewScout.
Your goal is to answer the user's question, sound like a human expert, and subtly encourage them to click the affiliate links or buy the products mentioned in the article they are reading.
Keep your answers very short, punchy, and conversational (1-3 sentences max).
Use emojis occasionally.
If they ask about a product, tell them it's highly recommended and they should check the price using the links on the page.

CONTEXT OF THE PAGE THEY ARE CURRENTLY READING:
${articleContext || "The homepage of ReviewScout, discovering the best software and products."}`;

    // Format history for Gemini
    const contents = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));
    
    // Add the latest message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: {
          role: "system",
          parts: [{ text: systemPrompt }]
        }
      }
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate response' }, { status: 500 });
  }
}
