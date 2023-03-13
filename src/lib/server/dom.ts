import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export function cleanUpHTML(bodyString: string, url: string): string {
  const doc = new JSDOM(bodyString, {url});
  const reader = new Readability(doc.window.document);
  const readabilityResult = reader.parse()!;
  const cleanedDoc = new JSDOM(readabilityResult.content, {url});
  return Array.from(cleanedDoc.window.document.querySelectorAll('#readability-page-1 > div > *'))
      .map((el) => el.textContent)
      .filter(String)
      .join('\n');
}
