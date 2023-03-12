import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import similarity from 'compute-cosine-similarity';
import {runEmbedding, constructChatMessages, runChatCompletion} from '$lib/server/openai';

const SIMILARITY_THRESHOLD = .7;

export const POST = (async ({request}) => {
  const requestBody = await request.json();
  const {apiKey, query, embeddings} = requestBody;

  try {
    console.info('==================== Embedding query');
    const queryEmbedding = (await runEmbedding(apiKey, [query]))[0].embedding;
    console.info('==================== Searching embedding');
    const searchResult = embeddings
      .map((entry) => ({
        ...entry,
        similarity: similarity(entry.embedding, queryEmbedding),
      }))
      .filter((entry) => entry.similarity > SIMILARITY_THRESHOLD)
      .sort((a, b) => a.similarity - b.similarity)
      .map((entry) => entry.content);
    const messages = constructChatMessages(searchResult, query)
    const result = await runChatCompletion(apiKey, messages);
    return new Response(JSON.stringify({result}));
  } catch (e) {
    console.info('==================== Error');
    console.error(e);
    throw error(400, (e as Error).message);
  }
}) satisfies RequestHandler;
