document.querySelector('button').addEventListener('click', () => {
  chrome.runtime.sendMessage(undefined, console.log);
});
