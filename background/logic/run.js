console.log('RUN.JS loaded');
var drTabID, bbTabID;

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

  // FIND THE CORRECT TWO TABS
  var drTab = null;
  var bbTab = null;

  chrome.windows.getAll({populate: true}, function(winds){
    var old_site = /http\:\/\/avondale-iol\/\w{2}-\d{3}\/\w{2}-\d{3}-\d{1}-Web\d{2,}\/sco\d{1,}\/lmsinit/;
    var new_site = /https\:\/\/uti\.blackboard.com\/courses\/\d{1}\/UTI_BMS_QA_UAT\/content/;    
    for (var i = 0; i < winds.length; i++) {
      for (var j = 0; j < winds[i].tabs.length; j++) {
        
        if(winds[i].tabs[j].url.match(old_site)){
          drTab = winds[i].tabs[j];
        }
        if(winds[i].tabs[j].url.match(new_site)){
          bbTab = winds[i].tabs[j];
        }
        
      }
    }

    if (!drTab || !bbTab) {
      console.log('SOMETHING WENT WRONG WITH FINDING THE TABS');
      return;
    }

    sendToTab('old-slide', {message: "blackout-box", data: "add-box-dr"});
    sendToTab('new-slide', {message: "blackout-box", data: "add-box-bb"});


    // save the screenshot data
    returnScreenshotImage(bbTab).then(function(img) {
      return new Promise(function(resolve, reject) {
        newSlideImg = img;
        resolve();
      });
    })
    .then(function() {
      return returnScreenshotImage(drTab);
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
              
              var oldStuff = data[0];
              var newStuff = data[1];

              console.log(oldStuff, newStuff);
              // compare the text

              var newWords = {};
              var oldWords = {};
              for (var n in newStuff) {
                newWords[n] = cleanWord(newStuff[n].word_text);
              }

              for (var o in oldStuff) {
                oldWords[o] = cleanWord(oldStuff[o].word_text);
              }

              for (var n in newWords) {
                for (var o in oldWords) {
                  console.log(newWords[n], oldWords[o]);
                  if (newWords[n] === oldWords[o]) { 
                    console.warn(newWords[n], oldWords[o]);
                    //find these in object
                    newStuff[n].matched = true;
                    oldStuff[o].matched = true;
                    delete newWords[n];
                    delete oldWords[o];
                    break;
                  }
                }
              }

              function cleanWord(word) {
                // console.log(word);
                var pattern_specialChars = /[^\w\s]/gi;

                var newWord = String(word).trim().toLowerCase();
                    newWord = newWord.replace(pattern_specialChars, ' ');
                    newWord = newWord.replace(/\s{2,}/g, ' ');
                return newWord;
              }

              // Format for the outgoing request object
                // {
                //   "message" :
                //   "data": [
                //      {
                //           height:
                //           width:
                //           top:
                //           left:
                //           word_text:
                //           matched:
                //      }
                //   ]
                // }


              chrome.tabs.sendMessage(drTab.id, { //to avondale
                "message" : "ocrData",
                "data"    : oldStuff
              });
              chrome.tabs.sendMessage(bbTab.id, { //to blackboard
                "message" : "ocrData",
                "data"    : newStuff
              })

            });
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
    for(var j = 0; j < img_data.ParsedResults[0].TextOverlay.Lines[i].Words.length; j++){

       var iterated_lines_with_words = img_data.ParsedResults[0].TextOverlay.Lines[i].Words[j];
        var words_object = {};
        words_object.height = iterated_lines_with_words.Height;
        words_object.width = iterated_lines_with_words.Width;
        words_object.left = iterated_lines_with_words.Left;
        words_object.top = iterated_lines_with_words.Top;
        words_object.word_text = iterated_lines_with_words.WordText;
        words_object.matched = false;

        //this is for testing and should be commented out.
        // if(i % 10 === 0){
        //   words_object.matched = false;
        // } else {
        //   words_object.matched = true;
        // }

        slideData.push(words_object);
      }
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

