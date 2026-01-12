import { google } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

import { SYSTEM_PROMPT } from './prompt';
import { getContact } from './tools/getContact';
import { getInternship } from './tools/getIntership';
import { getPresentation } from './tools/getPresentation';
import { getProjects } from './tools/getProjects';
import { getResume } from './tools/getResume';
import { getSkills } from './tools/getSkills';
import connectDB from '@/lib/mongodb';
import ChatHistory from '@/models/ChatHistory';
import syncPortfolioConfig from '@/lib/sync-config';

export const maxDuration = 30;

export async function POST(req: Request) {
  const groqApiKey = process.env.GROQ_API_KEY;
  const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const openRouterApiKey = process.env.OPENROUTER_API_KEY;
  const xaiApiKey = process.env.XAI_API_KEY || process.env.GROK_API_KEY;

  console.log('[CHAT-API] Multi-Model Load Balancing via OpenRouter Active');

  if (!groqApiKey && !googleApiKey && !openRouterApiKey && !xaiApiKey) {
    console.error('[CHAT-API] Missing API keys');
    return new Response(JSON.stringify({ error: 'Missing API keys' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    await connectDB();
    // Sync config - in a real app you might want to do this less frequently
    await syncPortfolioConfig();

    const { messages, sessionId } = await req.json();

    const tools = {
      getProjects,
      getPresentation,
      getResume,
      getContact,
      getSkills,
      getInternship,
    };

    let model;

    // We prioritize OpenRouter for "All LLM" load balancing as requested
    if (openRouterApiKey) {
      console.log('[CHAT-API] Using OpenRouter with multi-model fallback...');
      const openrouter = createOpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: openRouterApiKey,
        headers: {
          'HTTP-Referer': 'https://keshore-portfolio.vercel.app',
          'X-Title': 'Keshore Portfolio',
        },
      });

      const result = streamText({
        model: openrouter('google/gemini-2.0-flash-001'),
        experimental_providerMetadata: {
          openai: {
            extraBody: {
              models: [
                'google/gemini-2.0-flash-001',
                'anthropic/claude-3.5-haiku',
                'x-ai/grok-2-1212',
                'meta-llama/llama-3.3-70b-instruct',
                'deepseek/deepseek-chat',
                'qwen/qwen-2.5-72b-instruct',
                'google/gemini-flash-1.5',
                'openrouter/auto',
              ],
              route: 'fallback',
            },
          },
        },
        messages,
        tools,
        system: SYSTEM_PROMPT.content,
        maxSteps: 5,
        maxRetries: 2,
        async onFinish({ text }) {
          if (sessionId) {
            try {
              const lastUserMessage = messages[messages.length - 1];
              await ChatHistory.findOneAndUpdate(
                { sessionId },
                {
                  $push: {
                    messages: [
                      { role: 'user', content: lastUserMessage.content },
                      { role: 'assistant', content: text }
                    ]
                  }
                },
                { upsert: true }
              );
            } catch (err) {
              console.error('Failed to save chat history:', err);
            }
          }
        },
      });

      return result.toDataStreamResponse();
    }

    // Fallback to direct xAI if OpenRouter key is missing
    if (xaiApiKey) {
      console.log('[CHAT-API] Falling back to direct xAI...');
      const xai = createOpenAI({
        baseURL: 'https://api.x.ai/v1',
        apiKey: xaiApiKey,
      });
      model = xai('grok-2-latest');
    } else if (googleApiKey) {
      console.log('[CHAT-API] Falling back to direct Google Gemini...');
      model = google('gemini-1.5-flash');
    } else {
      console.log('[CHAT-API] Falling back to direct Groq...');
      const groq = createOpenAI({
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: groqApiKey,
      });
      model = groq('llama-3.1-8b-instant');
    }

    const result = streamText({
      model,
      messages,
      tools,
      system: SYSTEM_PROMPT.content,
      maxSteps: 5,
      maxRetries: 2,
      async onFinish({ text }) {
        if (sessionId) {
          try {
            const lastUserMessage = messages[messages.length - 1];
            await ChatHistory.findOneAndUpdate(
              { sessionId },
              {
                $push: {
                  messages: [
                    { role: 'user', content: lastUserMessage.content },
                    { role: 'assistant', content: text }
                  ]
                }
              },
              { upsert: true }
            );
          } catch (err) {
            console.error('Failed to save chat history:', err);
          }
        }
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('[CHAT-API] Error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('quota') || errorMessage.includes('429')) {
      return new Response(JSON.stringify({ error: 'All primary and fallback models hit quota limits. Please try again later.' }), {
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
