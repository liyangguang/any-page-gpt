import {apiKey} from './stores';

export async function fetchApi<ReponseBody>(path: string, body: Object): Promise<ReponseBody> {
  return new Promise((resolve, reject) => {
    apiKey.subscribe(async (storedKey) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
          method: 'POST',
          mode: 'cors',
          body: JSON.stringify({...body, apiKey: storedKey}),
        })
        if (!res.ok) reject(new Error(await res.text()))
        return resolve(res.json());
      } catch (e) {
        reject(e);
      }
    })
  });
}
