<script lang="ts">
  import {saveOpenAIApiKey} from '../shared/chrome';

  let apiKeyInput = '';

  function saveOpenAIApiKeyClick() {
    saveOpenAIApiKey(apiKeyInput);
  }
</script>

<div>
  <h2>Save OpenAI API key</h2>
  <input bind:value={apiKeyInput} placeholder="sk-...">
  <button on:click={saveOpenAIApiKeyClick}>save</button>
  <p>API key is only stored in your browser profile, and only used for your own usage. We don't keep it, or use it for any other purpose.</p>
</div>
