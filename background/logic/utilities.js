console.clear();
console.log('UTILITIES.JS loaded');

//
// getContext
//
// descr - returns a string describing the context of the page
// that the script is currently running inside of
global.getContext = function() {
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
// moveTabOff
//
// descr - updates qaData when tab is moved off of a window
function moveTabOff(tabId, detach_info) {
  console.log("moveTabOff");
  return new Promise(function(resolve, reject){
    var old_win_id = detach_info.oldWindowId;
    //check to see if window was deleted
    if(typeof qaData[old_win_id] !== 'undefined'){
      updateQaData(old_win_id, false);
    } else {
      //delete window
    }
    resolve();
  });
}

//
// moveTabOn
//
// descr - updates qaData when tab is moved onto a window
function moveTabOn(tabId, attach_info) {
  console.log("moveTabOn");
  return new Promise(function(resolve, reject){
    var new_win_id = attach_info.newWindowId;
    updateQaData(new_win_id, true);
    resolve();
  });
}

//
// createTab
//
// descr - updates qaData when new tab is created
function createTab(tab) { //called when ctrl+shift+t is pressed
  console.log("createTab");
  return new Promise(function(resolve, reject){
    updateQaData(tab.windowId, false);
    resolve();
  });
}

//
// removeTab
//
// descr - updates qaData when tab is closed
function removeTab(tabId, remove_info) { //called when window is closed (sometimes it doesn't find the window, if it doesn't, set windows and tabs to null from qadata)
  console.log("removeTab");
  if(typeof qaData[remove_info.windowId] !== 'undefined'){
    return new Promise(function(resolve, reject){
      updateQaData(remove_info.windowId, false);
      resolve();
    });
  }
}

//
// updateTab
//
// descr - updates qaData when tab is changed
function updateTab(tabId, change_info, tab) { //called when extension is clicked
  console.log("updateTab");
  return new Promise(function(resolve, reject){
    updateQaData(tab.windowId, false);
    resolve();
  });
}

//
// resetTabs
//
// descr - sets qaData[windowId].tabs' keys to null to prepare for updated info
function resetTabs(win_id) {
  for (var key in qaData[win_id].tabs) {
    qaData[win_id].tabs[key] = null;
  }
}

//
// createQaDataTemplate
//
// descr - defines the template of qaData
function createQaDataTemplate() {
  return {
    window: null,
    tabs: {
      dr: null,
      bb: null,
      tfs_log: null,
      tfs_board: null
    }
  };
}

//
// insertTabs
//
// descr - adds updated data to qaData[windowId].tabs' keys
function insertTabs(tabs) {
  var template = createQaDataTemplate();
  for (var i = 0; i < tabs.length; i++) {
    var curURL = tabs[i].url;
    if (curURL.includes('avondale-iol')) { 
      template.tabs.dr  = tabs[i]; 
    }
    else if (curURL.includes('prdtfs.uticorp.com')) { 
      if(curURL.includes('board')){
        template.tabs.tfs_board = tabs[i];
      } else {
        template.tabs.tfs_log = tabs[i];
      } 
    }
    else if (curURL.includes('uti.blackboard.com')) { 
      template.tabs.bb  = tabs[i]; 
    }
  }
  return template.tabs;
}

//
// updateQaData
//
// descr - updates qaData window and tabs info for a given window
function updateQaData(win_id, create_qaData_template) {
  chrome.windows.get(win_id, {populate:true}, function(win){
    //update window info
    new Promise(function(resolve, reject) {
      if(create_qaData_template){
        var template = createQaDataTemplate();
        qaData[win.id] = template;
        qaData[win.id].window = win; 
      }
      qaData[win.id].window = win;
    }); 
    //upadate tabs info
    new Promise(function(resolve, reject){
      resetTabs(win.id);
      var tabs = win.tabs;
      var inserted_tabs = insertTabs(tabs);
      qaData[win.id].tabs = inserted_tabs;
    });
  });
}

function findPopup(){
  chrome.windows.getAll({populate:true}, function(wins){
    for (var i = 0; i < wins.length; i++) {
      var win = wins[i];
      if(win.type === 'popup'){
        for (var j = 0; j < win.tabs.length; j++) {
          if(win.tabs[j].url.includes("uti.blackboard.com")){
            popup_id = win.tabs[j].id;
          }
        }
      }
    }
  });
  return popup_id;
}