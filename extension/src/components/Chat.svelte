<script lang="ts">
  import { tick } from 'svelte';
  import {fetchApi} from '../shared/utils';

  interface EmbedddingResponseBody {
    tokens: number;
    embeddings: number[];
  }

  interface CompletionResponseBody {
    tokens: number;
    result: string;
  }

  interface ChatConversation {
    user: string;
    bot: string;
  }

  let embeddingsCache: number[] = [];
  let query = '';
  let conversations: ChatConversation[] = [{user: '', bot: 'Hi, I can answer anything about the content on this page.'}];
  let latestConversation: ChatConversation;
  $: latestConversation = conversations[conversations.length - 1];

  function _updateLatestConversationBotMessage(message: string): void {
    latestConversation.bot = message;
    conversations = [...conversations];
  }

  async function _process(): Promise<void> {
    _updateLatestConversationBotMessage('Let me check the page...');

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const response = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.querySelector('body').innerHTML,
      })
      const htmlBody = response[0].result;
      _updateLatestConversationBotMessage('One sec, let me read the page...');

      const body = await fetchApi<EmbedddingResponseBody>('process', htmlBody);
      embeddingsCache = body.embeddings;
    } catch (e) {
      _updateLatestConversationBotMessage(`Hmm... I couldn't read the page. ${e?.message}`);
    }
  }

  async function ask() {
    if (!query) return;

    conversations = [...conversations, {user: query, bot: ''}];
    await tick();
    if (!embeddingsCache.length) await _process();

    _updateLatestConversationBotMessage('Thinking...');
    const body = await fetchApi<CompletionResponseBody>('reply', {embeddings: embeddingsCache, query});
    _updateLatestConversationBotMessage(body.result);
    query = '';
  }
</script>

{#each conversations as conversation}
  {#if conversation.user}<div class="user">{conversation.user}</div>{/if}
  <div class="bot">{conversation.bot}</div>
{/each}

<form on:submit|preventDefault={ask}>
  <input placeholder="What is the summary" bind:value={query}>
  <button disabled={!query}>ask</button>
</form>
