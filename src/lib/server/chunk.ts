import {countTokens} from '$lib/server/openai';

const EMBEDDING_CHUNK_TOKEN_SIZE = 200;

export function chunkContent(input: string): string[] {
  const sentences = input.split('\n').map(segmentContent).flat().map((s) => s.trim()).filter(String);
  console.log(sentences);
  return combinePartsIntoMaxSize(sentences);
}

const SENTENCE_SEGMENTER = new Intl.Segmenter('en', { granularity: 'sentence' });
function segmentContent(input: string): string[] {
  return Array.from(SENTENCE_SEGMENTER.segment(input)).map((segment) => segment.segment);
}

function combinePartsIntoMaxSize(sentences: string[]): string[] {
  const result: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if (countTokens(current) + countTokens(sentence) > EMBEDDING_CHUNK_TOKEN_SIZE) {
      result.push(current);
      current = '';
    }
    current += `\n${sentence}`;
  }
  if (current) result.push(current);

  return result;
}
