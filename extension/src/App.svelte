<script lang="ts">
  import Chat from '@/components/Chat.svelte';
  import Settings from '@/components/Settings.svelte';
  import Donut from '@/components/Donut.svelte';
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
    <button class="progress-button" on:click={() => isSettingPage = !isSettingPage} aria-label="Usage and Settings" title="Usage and Settings">
      <Donut value={$usedCost / FREE_TRIAL_LIMIT_IN_DOLLAR} />
      <span class="progress-button-i _sans" aria-hidden="true">{isSettingPage ? '<' : 'i'}</span>
    </button>
  </header>
  
  {#if isSettingPage}
    <Settings />
  {:else}
    <Chat />
  {/if}
</div>

<style>
  .page {
    /* This sets the size of the popup */
    width: 380px;
    height: 550px;

    display: grid;
    grid-template-rows: auto 1fr auto;
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

  .progress-button {
    width: 2em;
    position: relative;
  }

  .progress-button-i {
    position: absolute;
    inset: 0;
    font-weight: 600;
    line-height: 2em;
  }

  h1 {
    background-image: url(./assets/logo.svg);
    background-repeat: no-repeat;
    background-size: contain;
    background-position: left;
    padding-left: 2em;
    font-size: 1.2em;
  }

</style>
