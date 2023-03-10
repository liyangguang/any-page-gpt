const inputEl = document.querySelector('input');
const resultEl = document.querySelector('.result');
let embeddings;

document.querySelector('button.process').addEventListener('click', () => {
  resultEl.textContent = 'Processing...'
  chrome.runtime.sendMessage(undefined, async (html) => {
    console.info('[Popup] Received html');
    const res = await fetch('http://localhost:5173/api/process', {method: 'POST', body: JSON.stringify({content: html})})
    const body = await res.json();
    embeddings = body;
    resultEl.textContent = 'Processing done. Ready to answer questions.'
  });
});

document.querySelector('button.ask').addEventListener('click', async () => {
  if (!inputEl.value) return;

  resultEl.textContent = 'Asking...'
  console.info('[Popup] Asking');
  const res = await fetch('http://localhost:5173/api/reply', {method: 'POST', body: JSON.stringify({embeddings, query: inputEl.value})})
  const body = await res.json();
  console.log(body);
  resultEl.textContent = body.result;
});
