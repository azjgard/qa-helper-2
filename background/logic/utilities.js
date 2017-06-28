console.clear();
console.log('UTILITIES.JS loaded');

//
// getContext
//
// descr - returns a string describing the context of the page
// that the script is currently running inside of
var getContext = function() {
  var loc = window.location.href;

  var pattern_tfs      = /prdtfs\.uticorp\.com/i;
  var pattern_newSlide = /courses\/\w{1,}\/uti_bms_qa_uat\/content/i;
  var pattern_oldSlide = /lmsinit\.htm/i;

  function isPage(pattern) {
    return loc.match(pattern);
  }

  // DR site
  if (loc.includes('avondale-iol')) {
    if (isPage(pattern_oldSlide)) {
      return 'old-slide'; 
    }
    else {
      return 'dr';
    }
  }

  // TFS
  else if (isPage(pattern_tfs)) {
    if(loc.includes('board')){
      return 'tfs_board';
    }
    else {
      return 'tfs_log';
    }
  }

  // Blackboard site
  else if (loc.includes('uti.blackboard.com')) {
    if (isPage(pattern_newSlide)) {
      return 'new-slide'
    }
    else {
      return 'bb';
    }
  }

  // Site irrelevant to the plugin
  else {
    return 'misc';
  }
}


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
// descr - routes a message to tab of choice. All available tabs are 
// in the switch statement below.
function sendToTab(which_tab, request){
  var identifier;
  
  switch(which_tab){
    // tfs
    case "tfs_log":
      var identifier = { includes: 'prdtfs.uticorp.com', includes_2: 'level' };
      break;
    case "tfs_board":
      var identifier = { includes: 'prdtfs.uticorp.com', includes_2: 'board' };
      break;

    // avondale
    case "dr":
      var identifier = { includes: 'avondale-iol', includes_2: "scolist" };
      break;
    case 'old-slide':
      var identifier = { includes: 'avondale-iol', includes_2: "ShowCDMenu" };
      break;

    // blackboard
    case "bb":
      var identifier = { includes: 'uti.blackboard.com', includes_2: 'webapps' };
      break;
    case 'new-slide':
      var identifier = { includes: 'uti.blackboard.com', includes_2: 'courses' };
      break;

    default:
      var identifier = null;
      break;
  }

  //check if which_tab is valid
  if(identifier){
    
    chrome.tabs.query({}, function(tabs){
      for (var i = 0; i < tabs.length; i++) {

        //check identifier of tab url
        if (tabs[i].url.includes(identifier.includes)) { 
          
          //if second identifier is present, check which tab matches
          if(identifier.includes_2){
            if(tabs[i].url.includes(identifier.includes_2)){
              console.log("Sending message to " + which_tab);
              chrome.tabs.sendMessage(tabs[i].id, request);
            }
          }
          //if second identifier is null, send the message
          else {
            console.log("Sending message to " + which_tab);
            chrome.tabs.sendMessage(tabs[i].id, request);
          }
        }
      }
    });

  }
  else {
    return console.log('Please send in a valid identifier (e.g. "tfs_log"');
  }
}
