// ** BACKGROUND SCRIPT - NO DOM ACCESS **

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
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

    var mainWindow = '';

    var tabID_dr  = '',
        tabID_tfs = '',
        tabID_bb  = '';

    chrome.windows.create({ 
      url: [
        'http://avondale-iol/AD-105.html',
        'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs?level=Projects&showParents=false&_a=backlog',
        'https://uti.blackboard.com/webapps/login/?action=relogin'
      ]
    },
    function(win) {
      mainWindow = win;

      chrome.tabs.query({
        windowId: mainWindow.id
      },

      function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
          var curURL = tabs[i].url;

          if (curURL.includes('avondale-iol')) {
            tabID_dr = tabs[i].id;
            chrome.tabs.executeScript(tabs[i].id, {
              code: 'console.log("This is the OLLLD site.")'
            });
          }
          else if (curURL.includes('prdtfs.uticorp.com')) {
            tabID_tfs = tabs[i].id;
            chrome.tabs.executeScript(tabs[i].id, {
              code: 'console.log("This is TFS.")'
            });
          }
          else if (curURL.includes('uti.blackboard.com')) {
            tabID_bb = tabs[i].id;
            chrome.tabs.executeScript(tabs[i].id, {
              code: 'console.log("This is the NEW site.")'
            }); 
          }
        }
      });
    });

  //////////////////////////////////////////////
  });
});