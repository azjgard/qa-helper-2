// ** BACKGROUND SCRIPT - NO DOM ACCESS **
console.log('background script loaded');

var qaToolIsActive = false;

chrome.browserAction.onClicked.addListener(function(){
  initializeQaTool();
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
      runQaTool(); 
    }
    else if (msg === 'bug') { //sent from Add Bug button on new slides
      sendToTab("tfs_log", request);
    }
  }
);


