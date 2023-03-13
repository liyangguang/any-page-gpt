<script lang="ts">
  import Chat from '@/components/Chat.svelte';
  import Settings from '@/components/Settings.svelte';
  import {getOpenAIApiKeyFromStorage, getUsedCostFromStorage} from '@/shared/chrome';
  import {FREE_TRIAL_LIMIT_IN_DOLLAR, formatCurrency} from '@/shared/utils';
  import {apiKey, usedCost} from '@/shared/stores'

  let isSettingPage = false;
  let usedCostString = '';
  $: usedCostString = formatCurrency($usedCost, true);

  (async function () {
    [$apiKey, $usedCost] = await Promise.all([
      getOpenAIApiKeyFromStorage(),
      getUsedCostFromStorage(),
    ])

    if ($usedCost > FREE_TRIAL_LIMIT_IN_DOLLAR && !$apiKey) {
      isSettingPage = true;
    }
  })();
</script>

<h1>AnyPageGPT</h1>

<button on:click={() => isSettingPage = !isSettingPage}>{usedCostString} / {formatCurrency(FREE_TRIAL_LIMIT_IN_DOLLAR)}</button>

{#if isSettingPage}
  <Settings />
{:else}
  <Chat />
{/if}
