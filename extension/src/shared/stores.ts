import { writable } from 'svelte/store';

// Init from Storage in `App.svelte`
export const apiKey = writable('');

// Init from Storage in `App.svelte`
export const usedCost = writable(0);
