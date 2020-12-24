/*global chrome*/
// reference to send postMessage to App.js
var appRef;

// persist appRef to establish connection with App.js
chrome.extension.onConnect.addListener((port) => {
  appRef = port;
});

// listen messages from inject.js
chrome.runtime.onMessage.addListener((request = {}, sender, sendResponse) => {
  if (!!request.action) {
    // if has the keyword __callback, send to App.js
    if (request.action.includes("__callback")) {
      try {
        appRef.postMessage(request);
      } catch (err) {
        console.warn(err);
      }
    }
  }

  return true;
});
