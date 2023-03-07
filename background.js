function scrapePage() {
  return 'yg' + document.querySelector('p').textContent;
}

chrome.runtime.onMessage.addListener((request,sender,sendResponse) => {
  // MUST NOT use async/await here. This funtion needs the return value of `true`
  chrome.tabs.query({ currentWindow: true, active: true })
      .then((([tab]) => {
        return chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: scrapePage,
        });
      })).then((result) => {
        sendResponse(result[0].result);
      });

  // THIS IS CRITICAL! It must return `true` here to notify Chrome that the response will be async (above)
  return true;
});
