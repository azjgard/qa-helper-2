// ** BACKGROUND SCRIPT - NO DOM ACCESS **
console.log('background script loaded');

var qaData         = null;
var qaToolIsActive = false;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var msg    = request.message;

    // don't listen if there was no message attribute
    if (!msg) {
      throw "Message received, but there was no message attribute!";
      return;
    }

    // if there was a message attribute
    if (msg === 'initialize') {
      initializeQaTool()
        .then(function(data) {
          qaData = data; 
        });
    }
    else if (msg === 'run') {
      if (qaData !== null) {
        runQaTool(); 
      }
    }
  }
);

//
// runQaTool
//
// descr - 1. takes a screenshot of both pages
//         2. sends both screenshots to the OCR API
//         3. analyzes the responses
//         4. send the analyzed data to the new slide and old slide page
function runQaTool() {
  var oldSlideImg;
  var newSlideImg;

  // save the screenshot data
  returnScreenshotImage(qaData.tabs.bb).then(function(img) {
    return new Promise(function(resolve, reject) {
      newSlideImg = img;
      resolve();
    });
  })
  .then(function() {
    return returnScreenshotImage(qaData.tabs.dr);
  })
  .then(function(img) {
    return new Promise(function(resolve, reject) {
      oldSlideImg = img;
      resolve();
    });
  })

  // send responses to api
    .then(function() {

    })
}

// ocrProcessImage
//
// descr - accepts a base 64 image as a parameter,
// sends that image to the OCR API, and returns
// the response object
function ocrProcessImage(base64Image) {
  return new Promise(function(resolve, reject) {
    var baseUrl = 'https://api.ocr.space/parse/image';
    var apiKey  = '568f8d67af88957'

    var form = new FormData();
    form.append("language", "eng");
    form.append("isOverlayRequired", "true");
    form.append("base64Image", dataUrl);

    var settings = {
      "url"         : baseUrl,
      "data"        : form,
      "async"       : true,
      "method"      : "POST",
      "mimeType"    : "multipart/form-data",
      "crossDomain" : true,
      "processData" : false,
      "contentType" : false,
      "headers"     : {
        "apikey"        : apiKey,
        "cache-control" : "no-cache"
      }
    }

    $.ajax(settings).done(function (response) {
      var puncPattern = /[.,\/#!$%\^&\*;:{}=\-_`~()]/g;

      var text = JSON.parse(response).ParsedResults[0].ParsedText;
          text = text.replace(puncPattern, ' '); // remove punctuation
          text = text.replace(/\s{2,}/g, ' '); // remove multi spaces

      resolve(text);

      // chrome.tabs.sendMessage(activeTab.id, {
      //   "message": "page_text",
      //   "text"   : text
      // });
    }).error(function(err) { reject(err); });
  })
}

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
    }, 500);
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
// initializeQaTool
//
// descr - loads the window and new tabs for the qa_helper if it has
// not yet been activated. it also sets up the attributes of the global
// 'qaData' object to be able to reference in other parts of the code
function initializeQaTool() {

  function createWindow(obj) {
    return new Promise(function(resolve, reject) {
      chrome.windows.create({ 
        url: [
          'http://avondale-iol/AD-105.html',
          'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs?level=Projects&showParents=false&_a=backlog',
          'https://uti.blackboard.com/webapps/login/?action=relogin'
        ]
      }, function(win) {
        obj.window = win;
        resolve(obj);
      });
    });
  }

  function setTabInfo(obj) {
    return new Promise(function(resolve, reject) {
      chrome.tabs.query({ windowId : obj.window.id }, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
          var curURL = tabs[i].url;

          if (curURL.includes('avondale-iol'))            { obj.tabs.dr  = tabs[i]; }
          else if (curURL.includes('prdtfs.uticorp.com')) { obj.tabs.tfs = tabs[i]; }
          else if (curURL.includes('uti.blackboard.com')) { obj.tabs.bb  = tabs[i]; }

          resolve(obj);
        }
      });
    });
  }

  return new Promise(function(resolve, reject) {
    var obj = {
      window: null,
      tabs: {
        dr: null,
        bb: null,
        tfs: null
      }
    };

    createWindow(obj)
      .then(setTabInfo)
      .then(function(obj) {
        qaToolIsActive = true;
        resolve(obj);
      });
  });
}
