import { writable } from 'svelte/store';

// Init from Storage in `App.svelte`
export const apiKey = writable('');

// TODO: change to cost?
// Init from Storage in `App.svelte`
export const usedToken = writable(0);
