console.clear();
console.log('UTILITIES.JS loaded');

//
// returnScreenshotImage
//
// descr - returns a promise whose value is a screenshot
// in base64 form of the tab object that was passed as an 
// argument
function returnScreenshotImage(tab) {
  return new Promise(function(resolve, reject) {
    focusWindow(tab.windowId)
      .then(function() {
        return focusTab(tab);
      })
      .then(getScreenshot)
      .then(function(dataURI) {
        resolve(dataURI);
      });
  });
}

//
// getScreenshot
//
// descr - screenshot the current tab and return a promise
// whose value is a screenshot in base64 form
function getScreenshot() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      chrome.tabs.captureVisibleTab(function(dataURI) {
        sendToTab('old-slide', {message: "blackout-box", data: "remove-box-dr"});
        sendToTab('new-slide', {message: "blackout-box", data: "remove-box-bb"});
        resolve(dataURI);
      });
    }, 1000);
  });
}

//
// focusTab
//
// descr - returns a promise; sets focus to the tab object
// passed in as an argument
function focusTab(tab) {
  return new Promise(function(resolve, reject) {
    chrome.tabs.update(tab.id, { active: true }, function() {
      console.log('just focused the tab');
      resolve();
    });
  });
}

//
// focusQAWindow
//
// descr - sets the focus to the window that is opened by the extension
function focusWindow(windowID) {
  return new Promise(function(resolve, reject) {
    chrome.windows.update(windowID, { focused : true }, function() {
      console.log('just focused the window');
      resolve();
    });
  });
}

//
// sendToTab
//
// descr - routes a message to tab of choice.
function sendToTab(which_tab, request){
  chrome.tabs.query({}, function(tabs){
    for (var i = 0; i < tabs.length; i++) {

      var context = getContext(tabs[i].url);
      
      if(context === which_tab){
        console.log("Sending message to " + context);
        chrome.tabs.sendMessage(tabs[i].id, request)
      }   
    }
  });
}

//
// getTabID
//
// descr - routes a message to tab of choice.
function getTabID (which_tab) {
  return new Promise( (resolve, reject) => {
    chrome.tabs.query({}, function(tabs){
      for (var i = 0; i < tabs.length; i++) {
        console.log(tabs[i]);
        var context = getContext(tabs[i].url);
        console.log('context:');
        console.log(context);
        
        if (context === which_tab){
          console.log('GOTCHA!');
          resolve(tabs[i].id);
        }   
      }
    });
  });
}