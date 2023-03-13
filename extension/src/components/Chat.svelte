<script lang="ts">
  import { tick } from 'svelte';
  import {getAnswer, scrapePage, getEmbeddings} from '../shared/utils';
  import type {EmbeddingBody} from '../shared/types';

  interface ChatConversation {
    user: string;
    bot: string;
  }

  let embeddingsCache: EmbeddingBody[] = [];
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
      const pageInfo = await scrapePage();
      _updateLatestConversationBotMessage('One sec, let me read the page...');
      embeddingsCache = await getEmbeddings(pageInfo)
    } catch (e) {
      console.error(e);
      _updateLatestConversationBotMessage(`Hmm... I couldn't read the page. ${e?.message}`);
      throw e;
    }
  }

  async function ask() {
    if (!query) return;

    conversations = [...conversations, {user: query, bot: ''}];
    await tick();
    if (!embeddingsCache.length) await _process();

    _updateLatestConversationBotMessage('Thinking...');
    try {
      const result = await getAnswer(embeddingsCache, query);
      _updateLatestConversationBotMessage(result);
      query = '';
    } catch (e) {
      console.error(e);
      _updateLatestConversationBotMessage(`Hmm... Something went wrong... ${e?.message}`);
    }
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
