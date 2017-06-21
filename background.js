// ** BACKGROUND SCRIPT - NO DOM ACCESS **
console.log('background script loaded');

var qaData         = null;
var qaToolIsActive = false;

chrome.browserAction.onClicked.addListener(function(){
  initializeQaTool()
        .then(function(data) {
          qaData = data; 
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

  .then(function() {
    var oldSlideWords = ocrProcessImage(oldSlideImg);
    var newSlideWords = ocrProcessImage(newSlideImg);

    Promise.all([oldSlideWords, newSlideWords])
      .then(function(values) {

        var oldData = values[0];
        var newData = values[1];

        formatParsedImageData(oldData, newData)
          .then(function(data){

            // TODO: compare the text before sending the data
            // to the pages




          // Format for the outgoing request object
            // {
            //   "message" :
            //   "data": [
          //          {
                        // height:
                        // width:
                        // top:
                        // left:
                        // word_text:
                        // matched:
          //          }
            //   ]
            // }

                

                // for (var line in oldTextObj.Lines) {
                //   for (var word in oldTextObj.Lines.Words) {
                    
                //   }
                // }

                chrome.tabs.sendMessage(qaData.tabs.dr.id, { //to avondale
                  "message" : "ocrData",
                  "data"    : data
                });
                chrome.tabs.sendMessage(qaData.tabs.bb.id, { //to blackboard
                  "message" : "ocrData",
                  "data"    : data
                })

          });
      });
  });
}

function formatParsedImageData(old_parsed_img, new_parsed_img){
  return new Promise(function(resolve, reject) {
    var oldstuff = loopThroughImageData(old_parsed_img);
    var newstuff = loopThroughImageData(new_parsed_img);

    resolve([oldstuff, newstuff]);
  });
}


function loopThroughImageData(img_data){
  var slideData = [];
  for (var i = 0; i < img_data.ParsedResults[0].TextOverlay.Lines.length; i++) {
        var iterated_lines_with_words = img_data.ParsedResults[0].TextOverlay.Lines[i].Words[0];
        var words_object = {};
        words_object.height = iterated_lines_with_words.Height;
        words_object.width = iterated_lines_with_words.Width;
        words_object.left = iterated_lines_with_words.Left;
        words_object.top = iterated_lines_with_words.Top;
        words_object.word_text = iterated_lines_with_words.WordText;
        slideData.push(words_object);
      }
    return slideData;
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
    form.append("base64Image", base64Image);

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

      var text = JSON.parse(response);//.ParsedResults[0].ParsedText;
          // text = text.replace(puncPattern, ' '); // remove punctuation
          // text = text.replace(/\s{2,}/g, ' '); // remove multi spaces

      resolve(text);

    });
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
