<script lang="ts">
  const STORAGE_KEY_NAME = 'openai_apiKey';

  let isSettingPage = false;
  let apiKey = '';
  let embeddings = [];
  let query = '';
  let result = '';

  function _getKeyFromStorage() {
    chrome.storage.sync.get(STORAGE_KEY_NAME, (value) => {
      apiKey = value[STORAGE_KEY_NAME] || '';
      isSettingPage = !apiKey
    });
  }

  function process() {
    result = 'Processing...'
    chrome.runtime.sendMessage(undefined, async (pageInfo) => {
      console.info('[Popup] Received html');
      try {
        const body = await fetchJson('http://localhost:5173/api/process', pageInfo)
        embeddings = body;
        result = 'Processing done. Ready to answer questions.'
      } catch (e) {
        result = `Failed processing. ${e.message}`
      }
    });
  }

  async function ask() {
    if (!query) return;

    result = 'Asking...'
    console.info('[Popup] Asking');
    const body = await fetchJson('http://localhost:5173/api/reply', {embeddings, query: query})
    console.log(body);
    result = body.result;
  }

  function saveKey() {
    chrome.storage.sync.set({[STORAGE_KEY_NAME]: apiKey}, () => {
      console.info('[Extension] Stored API key')
      isSettingPage = false;
    });
  }

  async function fetchJson(url, body) {
    if (!apiKey) throw new Error('No API key provided');
    const res = await fetch(url, {method: 'POST', body: JSON.stringify({...body, apiKey: apiKey})})
    if (!res.ok) throw new Error(await res.text())
    return await res.json();
  }

  _getKeyFromStorage()
</script>

<h1>Ask GPTa</h1>

{#if !isSettingPage}
  <div>
    <button on:click={process}>process</button>
    <input bind:value={query} disabled={!!embeddings.length}>
    <button on:click={ask} disabled={!!embeddings.length}>ask</button>
    <p>{result}</p>
    <button on:click={() => isSettingPage = true}>edit key</button>
  </div>
{:else}
  <div>
    <h2>Save OpenAI API key</h2>
    <input bind:value={apiKey} placeholder="sk-...">
    <button on:click={saveKey}>save</button>
    <p>API key is only stored in your browser profile, and only used for your own usage. We don't keep it, or use it for any other purpose.</p>
  </div>
{/if}
