import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import watch from "rollup-plugin-watch";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      // Rollup by default can only watch files in the compile graph.
      // This adds watching for static files (`manifest.json` and `background.js`)
      plugins: [ watch({ dir: "public" }) ]
    }
  },
})
