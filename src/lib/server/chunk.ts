/**
 * Split text into chunks, and try not to break the context of sentences.
 *
 * Four steps:
 * 1. Always split into paragraphs (line-break).
 * 2. For longer paragraphs, split into sentences by punctuations (but keep the punctuation in the content).
 * 3. For longer sentences, split into parts by space.
 * 4. For longer parts, just split by char count.
 */
export function chunkContent(input: string, size: number, sizeByFn: (input: string) => number): string[] {
  const temp: any[] =  input.split('\n').map((paragraph: string) => {
    if (sizeByFn(paragraph) < size) return paragraph;
    return combinePartsIntoMaxSize(splitParagraph(paragraph), size, sizeByFn).map((sentence) => {
      if (sizeByFn(sentence) < size) return sentence;

      // TODO: debug this - sizeByFn seems not applied correctly here.
      return combinePartsIntoMaxSize(splitParagraph(sentence, true), size, sizeByFn).map((part) => {
        if (sizeByFn(part) < size) return part;
        return splitTextIntoSize(part, size, sizeByFn);
      });
    })
  });
  const result: string[] = temp.flat(Infinity) as string[];
  return result.map((part) => part.trim()).filter(String);
}

const SENTENCE_SEGMENTER = new Intl.Segmenter('en', { granularity: 'sentence' });
const WORD_SEGMENTER = new Intl.Segmenter('en', { granularity: 'word' });
function splitParagraph(input: string, byWord = false): string[] {
  return Array.from((byWord ? WORD_SEGMENTER : SENTENCE_SEGMENTER).segment(input)).map((segment) => segment.segment);
}

function combinePartsIntoMaxSize(parts: string[], size: number, sizeByFn: (input: string) => number): string[] {
  const result: string[] = [];
  let current = '';
  for (const part of parts) {
    if (sizeByFn(current) + sizeByFn(part) > size) {
      result.push(current);
      current = '';
    }
    current += part;
  }
  if (current) result.push(current);

  return result;
}

function splitTextIntoSize(input: string, size: number, sizeByFn: (input: string) => number): string[] {
  const chunks = [];
  for (let i = 0; i < sizeByFn(input); i += size) {
      chunks.push(input.substring(i, i + size));
  }
  return chunks;
}
