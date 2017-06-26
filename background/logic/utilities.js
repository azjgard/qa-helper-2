console.log('UTILITIES.JS loaded');

//
// returnScreenshotImage
//
// descr - returns a promise whose value is a screenshot
// in base64 form of the tab object that was passed as an 
// argument
function returnScreenshotImage(tab) {
  return new Promise(function(resolve, reject) {
    focusQAWindow()
      .then(function() {
        return focusTab(tab);
      })
      .then(getScreenshot)
      .then(function(dataURI) {
        resolve(dataURI);
      })
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
function focusQAWindow() {
  return new Promise(function(resolve, reject) {
    chrome.windows.update(qaData.window.id, { focused : true }, function() {
      console.log('just focused the window');
      resolve();
    });
  })
}

//
// removeOldTab
//
// descr - removes a tab from the window object and tabs object stored in the qaData
// global object when the tab is moved to a different window
function removeOldTab(tabID, detachInfo){

  return new Promise(function(resolve, reject) {

    var old_window = qaData[detachInfo.oldWindowId];
    // console.log(tabID, detachInfo);
    //remove from window object
    new Promise(function(resolve, reject) {
      for(var i = 0; i < old_window.window.tabs.length; i++){
        var tab = old_window.window.tabs[i];
        if(tab.id === tabID) {
          old_window.window.tabs.splice(i, 1); 
        }
      }
      resolve();
    });
  
    //remove from tabs object
    new Promise(function(resolve, reject) {

      for(var key in old_window.tabs){
        var tab = old_window.tabs[key];
        console.log("out");
        if(!tab) {
          if(old_window.window.tabs.length === 0) {
            delete qaData[detachInfo.oldWindowId];
          }
        }
        if(tab && tab.id === tabID){
          console.log("in");
          // console.log(tab);
          qaData[detachInfo.oldWindowId].tabs[key] = null;
        }
      }
      resolve();
    });

    resolve();
  });
}

//
// addNewTab
//
// descr - adds information into qaData of new tabs that have been created
function addNewTab(tabID, attachInfo) {
  return new Promise(function(resolve, reject) {
    // console.log(tabID, attachInfo);

    //THE FUNCTION BELOW ALWAYS OVERWRITES A WINDOW, FIX IT SO THAT IT JUST ADDS TO THE WINDOW
    //DO IT BY CHECKING IF THE WINDOW EXISTS
    chrome.windows.get(attachInfo.newWindowId, {populate : true}, function(win){
      
      if(typeof qaData[attachInfo.newWindowId] === 'undefined'){
        qaData[attachInfo.newWindowId] = {
          window: win,
          tabs: {
            dr: null,
            bb: null,
            tfs_log: null,
            tfs_board: null
          }
        };
      } else {
        
      }

      chrome.tabs.get(tabID, function(tab) {
        
        var curURL = tab.url;

        if (curURL.includes('avondale-iol'))                { qaData[attachInfo.newWindowId].tabs.dr  = tab; }
            else if (curURL.includes('prdtfs.uticorp.com')) { 
              if(curURL.includes('board')){
                                                              qaData[attachInfo.newWindowId].tabs.tfs_board = tab;
              } else {
                                                              qaData[attachInfo.newWindowId].tabs.tfs_log = tab;
              } 
            }
            else if (curURL.includes('uti.blackboard.com')) { qaData[attachInfo.newWindowId].tabs.bb  = tab; }
      });
      
    });
    resolve();
  });
}

//
// closeOutTab
//
// descr - removes information of deleted tabs from qaData when a tab is closed out
function closeOutTab(tabID, removeInfo) {
  return new Promise(function(resolve, reject) {
    var windowID = removeInfo.windowId;
    if(removeInfo.isWindowClosing){
      delete qaData[windowID];
    } else {
      
      //remove tab info from tabs object in qaData object
      for(var key in qaData[windowID].tabs){
        if(qaData[windowID].tabs[key] && qaData[windowID].tabs[key].id === tabID) {
          qaData[windowID].tabs[key] = null;
        } 
      }

      //remove tab info from window object in qaData object
      for(var i = 0; i < qaData[windowID].window.tabs.length; i++){
        if(qaData[windowID].window.tabs[i].id === tabID) {
          qaData[windowID].window.tabs.splice(i, 1); 
        } 
      }

    }// end else
    console.log(qaData)
    resolve();
  });
};