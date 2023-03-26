import {get} from 'svelte/store';
import {apiKey, usedCost} from '@/shared/stores';
import type {EmbeddingResult, PageContent, ReplyRequestBody, ReplyResponseBody, ProcessRequestBody, ProcessResponseBody} from '$be/types';
import {updateUsedCost} from '@/shared/chrome';

const SKIP_API_CALL = false;

export const FREE_TRIAL_LIMIT_IN_DOLLAR = 0.1;

export function formatCurrency(dollars: number): string {
  return `${Math.round(dollars * 1000)}`;
}

export async function scrapePage(): Promise<PageContent> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const response = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => document.querySelector('body').innerHTML,
  })
  return {content: response[0].result, url: tab.url};
}

export async function getEmbeddings(pageInfo: PageContent): Promise<EmbeddingResult[]> {
  if (SKIP_API_CALL) return [];
  const body = await fetchApi<ProcessRequestBody, ProcessResponseBody>('process', pageInfo);
  usedCost.update((previous) => previous + body.cost);
  updateUsedCost(body.cost)
  return body.embeddings;
}

export async function getAnswer(embeddings: EmbeddingResult[], query: string): Promise<string> {
  if (SKIP_API_CALL) return 'Example answer. '.repeat(Math.random() * 10 + 1);
  const body = await fetchApi<ReplyRequestBody, ReplyResponseBody>('reply', {embeddings, query});
  usedCost.update((previous) => previous + body.cost);
  updateUsedCost(body.cost)
  return body.result;
}

async function fetchApi<RequestBody, ReponseBody>(path: string, requestBody: Omit<RequestBody, 'apiKey'>): Promise<ReponseBody> {
  const apiKeyValue = get(apiKey);
  const usedCostValue = get(usedCost);
  if (usedCostValue > FREE_TRIAL_LIMIT_IN_DOLLAR && !apiKeyValue) {
    throw new Error('You used up free credits. Go to settings page to set up your API key.');
  }
  const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify({...requestBody, apiKey: apiKeyValue}),
  })
  console.log(res)
  if (!res.ok) throw new Error(await res.text());
  const responseBody = await res.json();
  if (apiKeyValue) {
    responseBody.cost = 0;
  }
  return responseBody;
}
