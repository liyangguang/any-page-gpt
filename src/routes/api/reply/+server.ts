import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import similarity from 'compute-cosine-similarity';
import {runEmbedding, constructChatMessages, runChatCompletion} from '$lib/server/openai';
import type {EmbeddingResult} from '$lib/types';

export const POST = (async ({request}) => {
  const requestBody = await request.json();
  const {apiKey, query, embeddings}: {apiKey: string; query: string; embeddings: EmbeddingResult[]} = requestBody;

  try {
    let totalCost = 0;
    console.info('==================== Embedding query');
    const queryEmbeddingResponse = await runEmbedding(apiKey, [query]);
    const queryEmbedding = queryEmbeddingResponse.embeddings[0].embedding;
    totalCost += queryEmbeddingResponse.cost;
    console.info('==================== Searching embedding');
    const searchResult = embeddings
      .map((entry) => ({
        ...entry,
        similarity: similarity(entry.embedding, queryEmbedding),
      }))
      .sort((a, b) => a.similarity - b.similarity)
      .map((entry) => entry.content);
    const messages = constructChatMessages(searchResult, query)
    const {result, cost} = await runChatCompletion(apiKey, messages);
    totalCost += cost;
    return new Response(JSON.stringify({result, cost: totalCost}));
  } catch (e) {
    console.info('==================== Error');
    console.error(e);
    throw error(400, (e as Error).message);
  }
}) satisfies RequestHandler;
