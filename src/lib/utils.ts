export function fetchJson(url, body) {
  return fetch(url, {method: 'POST', body: JSON.stringify(body)}).then((res) => res.json())
}
