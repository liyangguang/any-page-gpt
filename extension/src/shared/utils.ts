import {apiKey} from './stores';

export async function fetchApi<ReponseBody>(url, body): Promise<ReponseBody> {
  return new Promise((resolve, reject) => {
    apiKey.subscribe(async (value) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {method: 'POST', body: JSON.stringify({...body, apiKey: value})})
      // TODO: add cost here
      if (!res.ok) reject(new Error(await res.text()))
      return resolve(res.json());
    })
  });
}
