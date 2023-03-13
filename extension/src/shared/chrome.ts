import {apiKey, usedCost} from './stores';

const OPENAI_API_KEY = 'OPENAI_API_KEY';
const FREE_TRIAL_USED_COST = 'FREE_TRIAL_USED_COST';

export const FREE_TRIAL_LIMIT = 5000;

export async function getOpenAIApiKeyFromStorage(): Promise<string> {
  const store = await chrome.storage.sync.get(OPENAI_API_KEY);
  const storedKey = store[OPENAI_API_KEY] || '';
  apiKey.set(storedKey);
  return storedKey;
}

export async function saveOpenAIApiKey(newKey: string): Promise<void> {
  await chrome.storage.sync.set({[OPENAI_API_KEY]: newKey});
  console.info('[Extension] Stored API key');
  apiKey.set(newKey);
}

export async function getUsedCostFromStorage(): Promise<number> {
  const store = await chrome.storage.sync.get(FREE_TRIAL_USED_COST);
  const sotredValue = store[FREE_TRIAL_USED_COST] || 0;
  usedCost.set(sotredValue);
  return sotredValue;
}

export async function updateUsedCost(newTokenUsed: number): Promise<void> {
  const previous = await getUsedCostFromStorage();
  await chrome.storage.sync.set({[FREE_TRIAL_USED_COST]: previous + newTokenUsed});
  console.info('[Extension] Stored token');
  usedCost.set(previous + newTokenUsed)
}
