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

  let embeddings: number[] = [];
  let query = '';
  let conversations: ChatConversation[] = [{user: '', bot: 'Hi, I can answer anything about the content on this page.'}];
  let latestConversation: ChatConversation;
  $: latestConversation = conversations[conversations.length - 1];

  function _updateLatestConversationBotMessage(message: string): void {
    latestConversation.bot = message;
    conversations = [...conversations];
  }

  function _process(): Promise<void> {
    _updateLatestConversationBotMessage('One sec, let me read the page...');
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(undefined, async (pageInfo) => {
        console.info('[Popup] Received html');
        try {
          const body = await fetchApi<EmbedddingResponseBody>('process', pageInfo);
          embeddings = body.embeddings;
          _updateLatestConversationBotMessage('Okay, I read the page. Let me think about your question...');
          resolve();
        } catch (e) {
          _updateLatestConversationBotMessage(`Hmm... I couldn't read the page. ${e?.message}`);
          reject(e);
        }
      });
    })
  }

  async function ask() {
    if (!query) return;

    conversations = [...conversations, {user: query, bot: ''}];
    await tick();
    if (!embeddings.length) await _process();

    _updateLatestConversationBotMessage('Thinking...');
    console.info('[Popup] Asking');
    const body = await fetchApi<CompletionResponseBody>('reply', {embeddings, query});
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
