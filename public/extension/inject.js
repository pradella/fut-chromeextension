/*global chrome*/

// https://gist.github.com/devjin0617/3e8d72d94c1b9e69690717a219644c7a

/**
 * injectScript - Inject internal script to available access to the `window`
 *
 * @param  {type} file_path Local path of the internal script.
 * @param  {type} tag The tag as string, where the script will be append (default: 'body').
 * @see    {@link http://stackoverflow.com/questions/20499994/access-window-variable-from-content-script}
 */
function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
}
injectScript(chrome.extension.getURL("extension/content.js"), "body");

/* --- START MESSAGING MIDDLEWARE --- */

// listen messages from content.js and pass to background.js
window.addEventListener(
  "message",
  (event) => chrome.runtime.sendMessage(event.data),
  false
);

// listen messages from App.js (chrome.tabs.sendMessage) and pass to content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  window.postMessage(request);
});

/* --- END MESSAGING MIDDLEWARE --- */