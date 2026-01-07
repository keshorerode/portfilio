import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

import { SYSTEM_PROMPT } from './prompt';
import { getContact } from './tools/getContact';
import { getInternship } from './tools/getIntership';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';

export const maxDuration = 30;

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('[CHAT-API] Missing GROQ_API_KEY');
    return new Response(JSON.stringify({ error: 'Missing API key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { messages } = await req.json();
    console.log('[CHAT-API] Messages count:', messages?.length);

    const tools = {
      getProjects,
      getPresentation,
      getResume,
      getContact,
      getSkills,
      getInternship,
    };

    console.log('[CHAT-API] Calling Groq llama-3.1-8b-instant...');

    // Use OpenAI-compatible client with Groq's base URL
    const groq = createOpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: apiKey,
    });

    const result = streamText({
      model: groq('llama-3.1-8b-instant'),
      messages,
      tools,
      system: SYSTEM_PROMPT.content,
      maxSteps: 3,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('[CHAT-API] Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check for specific OpenAI API errors
    if (errorMessage.includes('quota') || errorMessage.includes('429') || errorMessage.includes('insufficient_quota')) {
      return new Response(JSON.stringify({ error: 'API quota exceeded' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
