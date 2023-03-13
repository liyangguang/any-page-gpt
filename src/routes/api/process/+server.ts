import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {runEmbedding} from '$lib/server/openai';
import {chunkContent} from '$lib/server/chunk';
import { cleanUpHTML } from '$lib/server/dom';

export const POST = (async ({request}) => {
  const requestBody = await request.json();
  const {apiKey, content, url} = requestBody;

  const cleanedContent = cleanUpHTML(content, url);

  try {
    console.info('==================== Start chunking');
    const contentArray = chunkContent(cleanedContent);
    console.info('==================== Start embedding');
    const {embeddings, cost} = await runEmbedding(apiKey, contentArray);
    console.info('==================== Embedding done');
    return new Response(JSON.stringify({embeddings, cost}));
  } catch (e) {
    console.info('==================== Error');
    console.error(e);
    throw error(400, (e as Error).message);
  }
}) satisfies RequestHandler;
