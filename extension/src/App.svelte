<script lang="ts">
  import Chat from './components/Chat.svelte';
  import Settings from './components/Settings.svelte';
  import {getOpenAIApiKeyFromStorage, getUsedCostFromStorage, FREE_TRIAL_LIMIT} from './shared/chrome';
  import {apiKey, usedCost} from './shared/stores'

  const CURRENCY_FORMATTER_DETAILED = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 3 });
  const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD',  });

  let isSettingPage = false;
  let usedCostString = '';
  $: usedCostString = CURRENCY_FORMATTER_DETAILED.format($usedCost);

  (async function () {
    const [apiKeyFromStorage, freeTrialTokenUsedFromStoarge] = await Promise.all([
      getOpenAIApiKeyFromStorage(),
      getUsedCostFromStorage(),
    ])
    apiKey.set(apiKeyFromStorage);
    usedCost.set(freeTrialTokenUsedFromStoarge);

    if (freeTrialTokenUsedFromStoarge > FREE_TRIAL_LIMIT && !apiKeyFromStorage) {
      isSettingPage = true;
    }
  })();
</script>

<h1>Ask GPTa</h1>
<button on:click={() => isSettingPage = !isSettingPage}>{usedCostString} / {CURRENCY_FORMATTER.format(FREE_TRIAL_LIMIT)}</button>

{#if isSettingPage}
  <Settings />
{:else}
  <Chat />
{/if}
