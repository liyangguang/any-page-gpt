import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {runEmbedding, MODEL_MAX_TOKEN, countTokens} from '$lib/server/openai';
import {chunkContent} from '$lib/server/chunk';

export const POST = (async ({request}) => {
  const requestBody = await request.json();
  const {content} = requestBody;

  try {
    console.info('==================== Start chunking');
    const contentArray = chunkContent(content, MODEL_MAX_TOKEN, countTokens);
    console.info('==================== Start embedding');
    const embeddings = await runEmbedding(contentArray);
    console.info('==================== Embedding done');
    return new Response(JSON.stringify(embeddings));
  } catch (e) {
    console.info('==================== Error');
    console.error(e);
    throw error(400, e as Error);
  }
}) satisfies RequestHandler;
