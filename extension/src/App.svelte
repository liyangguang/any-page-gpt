<script lang="ts">
  import Chat from './components/Chat.svelte';
  import Settings from './components/Settings.svelte';
  import {getOpenAIApiKeyFromStorage, getUsedTokenCountFromStorage, FREE_TOKEN_LIMIT} from './shared/chrome';
  import {apiKey, usedToken} from './shared/stores'

  let isSettingPage = false;

  (async function () {
    const [apiKeyFromStorage, freeTrialTokenUsedFromStoarge] = await Promise.all([
      getOpenAIApiKeyFromStorage(),
      getUsedTokenCountFromStorage(),
    ])
    apiKey.set(apiKeyFromStorage);
    usedToken.set(freeTrialTokenUsedFromStoarge);

    if (freeTrialTokenUsedFromStoarge > FREE_TOKEN_LIMIT && !apiKeyFromStorage) {
      isSettingPage = true;
    }
  })();
</script>

<h1>Ask GPTa</h1>
<button on:click={() => isSettingPage = !isSettingPage}>{$usedToken} / {FREE_TOKEN_LIMIT}</button>

{#if isSettingPage}
  <Settings />
{:else}
  <Chat />
{/if}
