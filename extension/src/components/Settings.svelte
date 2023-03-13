<script lang="ts">
  import {saveOpenAIApiKey} from '@/shared/chrome';
  import {FREE_TRIAL_LIMIT_IN_DOLLAR, formatCurrency} from '@/shared/utils';

  let apiKeyInput = '';

  function saveOpenAIApiKeyClick() {
    saveOpenAIApiKey(apiKeyInput);
  }
</script>

<div>
  <h2>Save OpenAI API key</h2>
  <p>New user get a free trail of {formatCurrency(FREE_TRIAL_LIMIT_IN_DOLLAR)}. Use your own API key (with free credit from OpenAI) for unlimited usage.</p>
  <p>You can generate an API key (i.e. secret key) by one click on <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noreferrer">OpenAI setting</a> (create an account if haven't)</p>
  <input bind:value={apiKeyInput} placeholder="sk-...">
  <button on:click={saveOpenAIApiKeyClick}>save</button>
  <p>Your API key is only stored in your browser profile, and only used for your own usage. We don't keep it, or use it for any other purpose.</p>
</div>
