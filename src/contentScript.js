// contentScript.js
var onPage = window.location.href;
chrome.runtime.sendMessage({ onPage: onPage });

document.addEventListener("extensionButtonClick", function () {
  // Send a message to the background script when the event is triggered
  chrome.runtime.sendMessage({ action: "extensionButtonClicked" });
});
