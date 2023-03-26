import type { Handle } from '@sveltejs/kit';

// const EXTENSION_ORIGIN = 'chrome-extension://dpbkckaamhodgomcfilpdllcjloeomfi';
const EXTENSION_ORIGIN = 'https://en.wikipedia.org';

export const handle: Handle = async ({ resolve, event }) => {
  const response = await resolve(event);

  if (event.url.pathname.startsWith('/api')) {
    if(event.request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE',
          'Access-Control-Allow-Origin': EXTENSION_ORIGIN,
        }
      });
    }

    response.headers.append('Access-Control-Allow-Origin', EXTENSION_ORIGIN);
  }

  return response;
};
