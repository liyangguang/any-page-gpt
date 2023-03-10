function scrapePage() {
  return document.querySelector('body').innerHTML;
}

chrome.runtime.onMessage.addListener((request,sender,sendResponse) => {
  // MUST NOT use async/await here. This funtion needs the return value of `true`
  chrome.tabs.query({ currentWindow: true, active: true })
      .then((([tab]) => {
        console.info('[Background] Triggering scrapper');
        return chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: scrapePage,
        });
      })).then((result) => {
        console.info('[Background] Scrapper done');
        sendResponse(result[0].result);
      });

  // THIS IS CRITICAL! It must return `true` here to notify Chrome that the response will be async (above)
  return true;
});
