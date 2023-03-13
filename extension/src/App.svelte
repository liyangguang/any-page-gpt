<script lang="ts">
  import Chat from '@/components/Chat.svelte';
  import Settings from '@/components/Settings.svelte';
  import {getOpenAIApiKeyFromStorage, getUsedCostFromStorage} from '@/shared/chrome';
  import {FREE_TRIAL_LIMIT_IN_DOLLAR} from '@/shared/utils';
  import {apiKey, usedCost} from '@/shared/stores';

  let isSettingPage = false;

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

<div class="page">
  <header>
    <h1>AnyPageGPT</h1>
    <button on:click={() => isSettingPage = !isSettingPage} aria-label="Usage and Settings" title="Usage and Settings">{$usedCost / FREE_TRIAL_LIMIT_IN_DOLLAR}</button>
  </header>
  
  {#if isSettingPage}
    <Settings />
  {:else}
    <Chat />
  {/if}
</div>

<style>
  .page {
    display: grid;
    grid-template-rows: auto 1fr auto;
    width: 300px;
    height: 450px;
    background: #F8F8F8;
    outline: 1px solid red;
    margin: auto;
  }

  header {
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0px 4px 4px rgba(217, 217, 217, 0.25);
    padding: .6em 1em;
  }

  h1 {
    font-size: 1.2em;
  }
</style>
