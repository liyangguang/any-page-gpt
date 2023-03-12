import {apiKey, usedToken} from './stores';

const OPENAI_API_KEY = 'OPENAI_API_KEY';
const FREE_TRIAL_TOKEN_USED = 'FREE_TRIAL_TOKEN_USED';

export const FREE_TOKEN_LIMIT = 5000;

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

export async function getUsedTokenCountFromStorage(): Promise<number> {
  const store = await chrome.storage.sync.get(FREE_TRIAL_TOKEN_USED);
  const sotredValue = store[FREE_TRIAL_TOKEN_USED] || 0;
  usedToken.set(sotredValue);
  return sotredValue;
}

export async function updateTokenUsedCount(newTokenUsed: number): Promise<void> {
  const previous = await getUsedTokenCountFromStorage();
  await chrome.storage.sync.set({[FREE_TRIAL_TOKEN_USED]: previous + newTokenUsed});
  console.info('[Extension] Stored token');
  usedToken.set(previous + newTokenUsed)
}
