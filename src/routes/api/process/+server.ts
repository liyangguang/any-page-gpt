import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {runEmbedding} from '$lib/server/openai';
import {chunkContent} from '$lib/server/chunk';
import type { ProcessRequestBody, ProcessResponseBody } from '$lib/types';

export const POST = (async ({request}) => {
  const requestBody: ProcessRequestBody = await request.json();
  const {apiKey, content} = requestBody;

  try {
    console.info('==================== Start chunking');
    const contentArray = chunkContent(content);
    console.info('==================== Start embedding');
    const {embeddings, cost} = await runEmbedding(apiKey, contentArray);
    console.info('==================== Embedding done');
    const responseBody: ProcessResponseBody = {embeddings, cost}
    return new Response(JSON.stringify(responseBody));
  } catch (e) {
    console.info('==================== Error');
    console.error(e);
    throw error(400, (e as Error).message);
  }
}) satisfies RequestHandler;
