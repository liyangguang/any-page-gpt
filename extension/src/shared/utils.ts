import {apiKey, usedCost} from '@/shared/stores';
import type {EmbeddingResult, PageContent, ReplyRequestBody, ReplyResponseBody, ProcessRequestBody, ProcessResponseBody} from '$be/types';
import {updateUsedCost} from '@/shared/chrome';

export const FREE_TRIAL_LIMIT_IN_DOLLAR = 0.1;

const CURRENCY_FORMATTER_DETAILED = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 3 });
const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD',  });
export function formatCurrency(dollars: number, withExtraDigit = false): string {
  return withExtraDigit ? CURRENCY_FORMATTER_DETAILED.format(dollars) : CURRENCY_FORMATTER.format(dollars);
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
  const body = await fetchApi<ProcessRequestBody, ProcessResponseBody>('process', pageInfo);
  usedCost.update((previous) => previous + body.cost);
  updateUsedCost(body.cost)
  return body.embeddings;
}

export async function getAnswer(embeddings: EmbeddingResult[], query: string) {
  const body = await fetchApi<ReplyRequestBody, ReplyResponseBody>('reply', {embeddings, query});
  usedCost.update((previous) => previous + body.cost);
  updateUsedCost(body.cost)
  return body.result;
}

async function fetchApi<RequestBody, ReponseBody>(path: string, body: Omit<RequestBody, 'apiKey'>): Promise<ReponseBody> {
  return new Promise((resolve, reject) => {
    apiKey.subscribe(async (apiKeyValue) => {
      usedCost.subscribe(async (usedCostValue) => {
        if (usedCostValue > FREE_TRIAL_LIMIT_IN_DOLLAR && !apiKeyValue) {
          reject(new Error('You used up free credits. Go to settings page to set up your API key.'));
          return;
        }

        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({...body, apiKey: apiKeyValue}),
          })
          if (!res.ok) reject(new Error(await res.text()))
          return resolve(res.json());
        } catch (e) {
          reject(e);
        }
      });
    })
  });
}
