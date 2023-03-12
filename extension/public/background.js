function scrapePage() {
  return document.querySelector('body').innerHTML;
}

chrome.runtime.onMessage.addListener((request,sender,sendResponse) => {
  let url;
  // MUST NOT use async/await here. This funtion needs the return value of `true`
  chrome.tabs.query({ currentWindow: true, active: true })
      .then((([tab]) => {
        url = tab.url
        console.info('[Background] Triggering scrapper');
        return chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: scrapePage,
        });
      })).then((result) => {
        console.info('[Background] Scrapper done');
        sendResponse({content: result[0].result, url});
      });

  // THIS IS CRITICAL! It must return `true` here to notify Chrome that the response will be async (above)
  return true;
});
