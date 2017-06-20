// ** CONTENT SCRIPT - NO API ACCESS **

/*
	- Content scripts have access to the page but don't have access to the other Chrome APIs
	- Background scripts don't have access to the page but have access to every Chrome API
*/
console.log('the extension has loaded');


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
  }
);