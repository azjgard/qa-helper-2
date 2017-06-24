// ** BACKGROUND SCRIPT - NO DOM ACCESS **
console.log('background script loaded');

var qaData         = null;
var qaToolIsActive = false;

chrome.browserAction.onClicked.addListener(function(){
  initializeQaTool()
        .then(function(data) {
          qaData = data; 
          // console.log(qaData);
          //removes tab from qaData's memory when tab is moved from old window
          chrome.tabs.onDetached.addListener(moveTabOff);
          //adds tab to qaData's memory when tab is moved to new window
          chrome.tabs.onAttached.addListener(moveTabOn);
          //adds tab info to qaData's memory when tab is created
          chrome.tabs.onCreated.addListener(createTab);
          //removes tab info from qaData's memory when tab is closed
          chrome.tabs.onRemoved.addListener(removeTab);
          //updates qaData info when tab is changed
          chrome.tabs.onUpdated.addListener(updateTag);
        });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var msg    = request.message;

    // don't listen if there was no message attribute
    if (!msg) {
      throw "Message received, but there was no message attribute!";
      return;
    }
    else if (msg === 'run') { //this message will be sent from draggable qa bar
      console.log('received run message');
      if (qaData !== null) {
        runQaTool(); 
      }
    }
  }
);




