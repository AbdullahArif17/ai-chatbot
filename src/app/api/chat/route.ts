import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { Message } from '@/app/lib/chatStorage';

const generateGeminiResponse = async (messages: Message[]): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_GEMINI_BASE_URL;
  const modelName = process.env.NEXT_PUBLIC_GEMINI_MODEL_NAME;

  if (!apiKey || !baseUrl || !modelName) {
    throw new Error("Missing Gemini API configuration");
  }

  const url = `${baseUrl}/models/${modelName}:generateContent?key=${apiKey}`;

  try {
    // Format messages for Gemini API
    const contents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const response = await axios.post(url, {
      contents,
      generationConfig: {
        maxOutputTokens: 2000
      }
    });

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || 
           "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const response = await generateGeminiResponse(messages);
    
    return NextResponse.json({ 
      response,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Chat API is running',
    timestamp: Date.now()
  });
}