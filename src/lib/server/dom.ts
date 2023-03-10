import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export function cleanUpHTML(bodyString: string, url: string) {
  const doc = new JSDOM(bodyString, {url});
  const reader = new Readability(doc.window.document);
  return reader.parse();
}
