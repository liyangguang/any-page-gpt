// TODO: update to TS, probably use a framework.

const inputEl = document.querySelector('input.query');
const keyInputEl = document.querySelector('input.key');
const resultEl = document.querySelector('p.result');
const uiDiv = document.querySelector('div.ui');
const keyDiv = document.querySelector('div.key');
const askButton = document.querySelector('button.ask');

// TODO: save it into storage
let embeddings;  // cache
let API_KEY;

const STORAGE_KEY_NAME = 'openai_api_key';

(function init() {
  chrome.storage.sync.get(STORAGE_KEY_NAME, function(value){
    const key = value[STORAGE_KEY_NAME];
    if (key) {
      API_KEY = key;
      keyInputEl.value = key;
    }
    toggleUi(!!key)
  });

  document.querySelector('button.process').addEventListener('click', process);
  askButton.addEventListener('click', getReply);
  document.querySelector('button.save').addEventListener('click', saveKey);
  document.querySelector('button.edit-key').addEventListener('click', () => toggleUi(false))
})();

function process() {
  resultEl.textContent = 'Processing...'
  chrome.runtime.sendMessage(undefined, async (pageInfo) => {
    console.info('[Popup] Received html');
    try {
      const body = await fetchJson('http://localhost:5173/api/process', pageInfo)
      embeddings = body;
      resultEl.textContent = 'Processing done. Ready to answer questions.'
      askButton.disabled = false;
      inputEl.disabled = false;
    } catch (e) {
      resultEl.textContent = `Failed processing. ${e.message}`
    }
  });
}

async function getReply() {
  if (!inputEl.value) return;

  resultEl.textContent = 'Asking...'
  console.info('[Popup] Asking');
  const body = await fetchJson('http://localhost:5173/api/reply', {embeddings, query: inputEl.value})
  console.log(body);
  resultEl.textContent = body.result;
}

function saveKey() {
  chrome.storage.sync.set({[STORAGE_KEY_NAME]: keyInputEl.value}, () => {
    console.log(keyInputEl.value)
    toggleUi(!!keyInputEl.value)
  });
}

async function fetchJson(url, body) {
  if (!API_KEY) throw new Error('No API key provided');
  const res = await fetch(url, {method: 'POST', body: JSON.stringify({...body, apiKey: API_KEY})})
  if (!res.ok) throw new Error(await res.text())
  return await res.json();
}

function toggleUi(ready) {
  if (ready) {
    uiDiv.style.display = 'block';
    keyDiv.style.display = 'none'
  } else {
    uiDiv.style.display = 'none';
    keyDiv.style.display = 'block'
  }
  resultEl.textContent = '';
}