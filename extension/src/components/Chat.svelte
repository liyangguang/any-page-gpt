<script lang="ts">
  import { tick } from 'svelte';
  import {getAnswer, scrapePage, getEmbeddings} from '@/shared/utils';
  import type {EmbeddingResult} from '$be/types';
  import WaitingDot from '@/components/WaitingDot.svelte';

  interface ChatConversation {
    user: string;
    bot: string;
  }

  let embeddingsCache: EmbeddingResult[] = [];
  let query = '';
  let conversations: ChatConversation[] = [{user: '', bot: 'Hi, I can answer anything about the content on this page.'}];
  let latestConversation: ChatConversation;
  $: latestConversation = conversations[conversations.length - 1];
  let scrollAreaEl: HTMLElement;

  const HINTS = ['Give me a summary'];

  function _updateLatestConversationBotMessage(message: string): void {
    latestConversation.bot = message;
    conversations = [...conversations];
  }

  async function _process(): Promise<EmbeddingResult[]> {
    _updateLatestConversationBotMessage('Let me check the page...');

    try {
      const pageInfo = await scrapePage();
      _updateLatestConversationBotMessage('One sec, let me read the page...');
      return await getEmbeddings(pageInfo);
    } catch (e) {
      console.error(e);
      _updateLatestConversationBotMessage(`Hmm... I couldn't read the page. ${e?.message}`);
      throw e;
    }
  }

  async function ask(overwriteQuery?: string) {
    query = query || overwriteQuery;
    if (!query) return;

    conversations = [...conversations, {user: query, bot: ''}];    
    await tick();
    _scrollToBottom();

    if (!embeddingsCache.length) {
      embeddingsCache = await _process();
    }

    _updateLatestConversationBotMessage('Thinking...');
    try {
      const result = await getAnswer(embeddingsCache, query);
      _updateLatestConversationBotMessage(result);
      _scrollToBottom();
      query = '';
    } catch (e) {
      console.error(e);
      _updateLatestConversationBotMessage(`Hmm... Something went wrong... ${e?.message}`);
    }
  }

  async function _scrollToBottom() {
    await tick();
    scrollAreaEl.scrollTo({behavior: 'smooth', top: 9999999});
  }
</script>

<div class="scroll-area" bind:this={scrollAreaEl}>
  {#each conversations as conversation}
    {#if conversation.user}<div class="user">{conversation.user}</div>{/if}
    <div class="bot">
      {conversation.bot.replace(/\.\.\.$/, '')}
      {#if conversation.bot.endsWith('...')}<WaitingDot />{/if}
    </div>
  {/each}
</div>

<form on:submit|preventDefault={() => ask()}>
  {#if conversations.length === 1}
    <ul class="hints">
      {#each HINTS as hint}
        <li>
          <button type="button" class="tip" on:click={() => ask(hint)}>{hint}</button>
        </li>
      {/each}
    </ul>
  {/if}
  <input placeholder="Ask questions about this page" bind:value={query}>
  <button class="ask-button" disabled={!query} aria-label="Ask"></button>
</form>

<style>
  .scroll-area {
    overflow-y: auto;
    padding: .5em 1em 3em;
  }

  .user,
  .bot {
    border-radius: 1em;
    max-width: 90%;
    padding: .5em 1em;
    width: fit-content;
    margin-top: .5em;
    margin-bottom: .5em;
    background: #fff;
  }

  .user {
    color: #fff;
    background: #000;
    margin-left: auto;
  }

  .bot {
    color: #525253;
  }

  form {
    display: flex;
    align-items: center;
    gap: .5em;
    padding: 0.5em 1em;
    background: #fff;
    box-shadow: 0px -4px 4px rgba(217, 217, 217, 0.25);
    position: relative;
  }

  input {
    flex: 1;
    background: #F8F8F8;
    border-radius: 1em;
    padding: .5em 1em;
  }

  .hints {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100%;
    overflow-x: auto;
    display: flex;
    gap: 1em;
    white-space: nowrap;
    list-style: none;
    width: 100%;
    padding: .5em 1em;
  }

  .hints button {
    border: 1px solid #ccc;
    border-radius: 1em;
    background: #fff;
    padding: .2em 0.5em;
    transition: box-shadow .2s ease;
  }

  .hints button:hover {
    box-shadow: 1px 2px 4px #0003;
  }

  .ask-button {
    background-image: url(../assets/icon-send.svg);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    height: 2.5em;
    aspect-ratio: 1/1;
  }
</style>