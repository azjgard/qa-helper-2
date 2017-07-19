// ** BACKGROUND SCRIPT - NO DOM ACCESS **
console.log('background script loaded');

var qaToolIsActive = false;

chrome.browserAction.onClicked.addListener(function(){
  initializeQaTool()
    .then(function(data){

      //update storage with course info when correct page is loaded
      chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
        var request = { message:"save-in-storage", data: tab };
        sendToTab('bb', request);
      });

    });
});

var gData = [];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var msg    = request.message;

    console.log('who sent this?');
    console.log(sender);
    
    // don't listen if there was no message attribute
    if (!msg) {
      throw "Message received, but there was no message attribute!";
      return;
    }
    else if (msg === 'run') { //this message will be sent from draggable qa bar
      console.log('received run message');
      runQaTool(); 
    }

    else if (msg === 'openToWindow') {
      chrome.tabs.create({ url : request.url });
    }
    else if (msg === 'closeMe') {
      chrome.tabs.remove(sender.tab.id);
    }
    else if (msg === 'storeThis') {
      gData.push(request.data);
      console.log(gData);
    }
    else if(msg === 'to-old-slide'){
      console.log("in");
      sendToTab("dr", request);
    }
      else if(msg === 'help-page') {
	  chrome.tabs.create({url:'/help.html'});
      }

    ///////////////////////////////
    //// Route request handler ////
    ///////////////////////////////

    // TODO: add this ^^^^

    // From: new-slide
    // To:   tfs_log
    if (msg === 'bug') { 
      sendToTab("tfs_log-load_page", request);
    }
  }
);


