<script lang="ts">
import {fetchJson} from '$lib/utils';

async function run() {
  const embeddings = await fetchJson('/api/process', {content: `A quick-and-dirty way of figuring out if it's plausible that the contents of a given document are suitable for processing with Readability. It is likely to produce both false positives and false negatives. The reason it exists is to avoid bogging down a time-sensitive process (like loading and showing the user a webpage) with the complex logic in the core of Readability. Improvements to its logic (while not deteriorating its performance) are very welcome.`})
  console.log(embeddings)
  const result = await fetchJson('/api/reply', {embeddings, query: 'Why does it exist?'})
  console.log(result);
}
</script>

<button on:click={run}>test</button>
