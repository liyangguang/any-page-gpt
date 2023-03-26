<script lang="ts">
  import {saveOpenAIApiKey} from '@/shared/chrome';
  import {FREE_TRIAL_LIMIT_IN_DOLLAR, formatCurrency} from '@/shared/utils';
  import {apiKey, usedCost} from '@/shared/stores';

  let apiKeyInput = $apiKey;
  let saveButtonText = 'Save';
  $: usedCostString = formatCurrency($usedCost);

  async function formSubmit() {
    saveButtonText = 'Saving...';
    try {
      await saveOpenAIApiKey(apiKeyInput);
    } catch (e) {
      saveButtonText = `Failed. ${e?.message}`;
    }
    saveButtonText = 'Saved!';
  }
</script>

<main>
  <h2>Free credit usage</h2>
  {#if $apiKey}
    <p>(Using own API key)</p>
  {:else}
    <div class="bar-bg">
      <div class="bar" style="width: {$usedCost / FREE_TRIAL_LIMIT_IN_DOLLAR * 100}%"></div>
    </div>
    <p>{usedCostString} / {formatCurrency(FREE_TRIAL_LIMIT_IN_DOLLAR)} used. (Cost depends on the page content size)</p>
    <p class="note">Use your own API key below for unlimited usage (OpenAI has free credit, as well as paid usage).</p>
  {/if}
  <hr>
  <h2>My OpenAI API key</h2>
  <p>Generate it on <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noreferrer">OpenAI setting</a> (create an account if haven't)</p>
  <form on:submit|preventDefault={formSubmit}>
    <input bind:value={apiKeyInput} placeholder="sk-...">
    <button>{saveButtonText}</button>
  </form>
  <p class="note">Your API key is only stored in your browser profile, and only used for your own usage.</p>
  <hr>
  <div class="grow"></div>
  <footer>
    Developed by Yangguang. Designed by Yi. <a href="https://any-page-gpt.vercel.app/#about" target="_blank" rel="noreferrer">Learn more</a>
  </footer>
</main>


<style>
  main {
    font-size: 0.9em;
    padding: 1em;
    display: flex;
    flex-direction: column;
    justify-content: start;
    min-height: 100%;
  }

  h2 {
    font-size: 1.2em;
  }

  hr {
    margin: 1em 0;
    opacity: 0.6;
  }

  form {
    display: flex;
    align-items: center;
    gap: .5em;
  }

  input {
    flex: 1;
    padding: .5em;
  }

  button {
    border: 1px solid #ccc;
    border-radius: .5em;
    padding: .3em 0.5em;
    background: #fff;
  }

  .note {
    font-size: .85em;
    margin-top: 0.5em;
  }

  .note::before {
    content: '* ';
  }

  .grow {
    flex: 1;
  }

  .bar-bg {
    background: #fff;
    border-radius: .25em;
    margin: 0.5em;
  }

  .bar {
    background-image: linear-gradient(#FFBF98, #F76B79);
    border-radius: .25em;
    height: .5em;
  }
</style>
