// ** BACKGROUND SCRIPT - NO DOM ACCESS **
console.log('background script loaded');

var qaToolIsActive = false;
var qaData = {
  window : '',
  tabs : {
    dr  : '',
    tfs : '',
    bb  : ''
  }
};

chrome.browserAction.onClicked.addListener(initializeQaTool);


// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     var msg = request.message;

//     if (!msg) {
//       throw "Message received, but there was no message attribute!";
//     }
//     else {
//       if (msg === 'initialize') {
//         initializeQaTool();
//       }
//     }
//   });



// Called when the user clicks on the browser action.
// chrome.browserAction.onClicked.addListener(function(tab) {
//   console.log('clikkkkkkk');
//   if (!qaToolIsActive) {
//     console.log('it is not active');
//     initializeQaTool(); 
//   }
//   else {
//     // show the dialog
//   }

/*


  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

    // active tab in current window will always return an array with a length of 1
    var activeTab = tabs[0];

    // take a screenshot and send it to the content
    chrome.tabs.captureVisibleTab(function(dataUrl) {

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

        var text = JSON.parse(response);//.ParsedResults[0].ParsedText;
           // text = text.replace(puncPattern, ' '); // remove punctuation
           // text = text.replace(/\s{2,}/g, ' '); // remove multi spaces

        chrome.tabs.sendMessage(activeTab.id, {
          "message": "page_text",
          "text"   : text
        });
      });
    });
  });
*/
// });

//
// initializeQaTool
//
// descr - loads the window and new tabs for the qa_helper if it has
// not yet been activated. it also sets up the attributes of the global
// 'qaData' object to be able to reference in other parts of the code
function initializeQaTool() {
//test data to send to content.js
var bob = {
      message : "Test Message",
      colors : {
        green : [
          {
            width : 315,
            height : 32,
            left : 300,
            top : 50
          },
          {
            width : 100,
            height : 100,
            left : 50,
            top : 50
          },
          {
            width : 100,
            height : 100,
            left : 150,
            top : 150
          }
        ],
        red : [
          {
            width : 100,
            height : 100,
            left : 300,
            top : 300
          },
          {
            width : 100,
            height : 100,
            left : 500,
            top : 500
          },
          {
            width : 100,
            height : 100,
            left : 700,
            top : 700
          }
        ]
      }
    };

  console.log("initialize");
  chrome.tabs.query({active: true, currentWindow: true}, function(tab_info) {
    console.log(tab_info[0].url);
    //provide different pages for different websites when users click on the extension
    if(tab_info[0].url.includes('avondale-iol')){
      //load specific helper bar on the page (you can't get rid of the popup once you set it)
      chrome.tabs.sendMessage(tab_info[0].id, bob, function(response) {});
      console.log('avon', response);
    } else if(tab_info[0].url.includes('prdtfs.uticorp.com')){
      //load specific helper bar on the page (you can't get rid of the popup once you set it)
      chrome.tabs.sendMessage(tab_info[0].id, bob, function(response) {});
      console.log('tfs');
    } else if(tab_info[0].url.includes('uti.blackboard.com')){
      //load specific helper bar on the page (you can't get rid of the popup easily once you set it)
      chrome.tabs.sendMessage(tab_info[0].id, bob, function(response) {});
      console.log('bb');
    } else { //open the 3 needed pages for tfs
      qaToolIsActive = true;

      chrome.windows.create({ 
        url: [
          'http://avondale-iol/AD-105.html',
          'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs?level=Projects&showParents=false&_a=backlog',
          'https://uti.blackboard.com/webapps/login/?action=relogin'
        ]
      },

      // callback after the window is created
      function(win) {
        qaData.window = win;

        // cycle through the tabs in the new window
        chrome.tabs.query({ windowId : qaData.window.id },
        function (tabs) {
          for (var i = 0; i < tabs.length; i++) {
            var curURL = tabs[i].url;

            if (curURL.includes('avondale-iol'))            { qaData.tabs.dr  = tabs[i]; }
            else if (curURL.includes('prdtfs.uticorp.com')) { qaData.tabs.tfs = tabs[i]; }
            else if (curURL.includes('uti.blackboard.com')) { qaData.tabs.bb  = tabs[i]; }
          }
          // console.log(win);
          // console.log(tabs);
        });
      });
    }
  });
}
