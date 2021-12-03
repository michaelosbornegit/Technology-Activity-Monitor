chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status && changeInfo.status === 'complete') {
    console.log(tab);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    console.log(tab);
  })
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
});