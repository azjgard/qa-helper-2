(function($, global) {
// Message Listener
//
// descr - listen to messages from the background.
// For obvious reasons, this does not need to be a
// member of the global QA variable.
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var msg = request.message;
    var msg_data = request.data;
    
    // don't listen if there was no message attribute
    if (!msg) {
      throw "Message received, but there was no message attribute!";
      return;
    }
    else if (msg === 'ocrData') { //this message will be sent from draggable qa bar
      console.log('received run message');
        //add divs to the screen to highlight text
        console.log(msg_data);

        //remove all the blackout boxes
        $("#blackout-top-dr").remove();
        $("#blackout-left-dr").remove();
        $('.footer-bar-box.slide.qa-ext_draggable.ui-draggable').show();
        $("#blackout-top-bb").remove();
        $('.footer-bar-box.slide.qa-ext_draggable.ui-draggable').show();

        for (var i = 0; i < msg_data.length; i++) {
            var div = document.createElement('div');
            if(msg_data[i].matched){
              div.classList.add('qa2-word-found');
            } else {
              div.classList.add('qa2-word-not-found');
            }
            div.style.height = (msg_data[i].height + 5) + 'px';
            div.style.width = (msg_data[i].width + 5) + 'px';
            div.style.top = (msg_data[i].top - 2.5) + 'px';
            div.style.left = (msg_data[i].left - 2.5) + 'px';
            document.body.appendChild(div); 
        }

        //watch to remove all OCR divs when next is clicked on new slide
        $('body').get(0).addEventListener('click', function(){
          $('.qa2-word-not-found').remove();
          $('.qa2-word-found').remove();
        }, true);
    }

    // From: new-slide
    // To:   tfs_log
    if (msg === 'bug') { 

      // TODO: fix the dummy data
      global.addItem(
        "Content QA",
        "Bug",
        "AD12-105",
        "04",
        'this is a test tag'
      );
    }
    if(msg === "blackout-box") {
      if(msg_data === "add-box-dr"){
        var div = document.createElement('div');
        div.id = 'blackout-left-dr';
        var div2 = document.createElement('div');
        div2.id = 'blackout-top-dr';
        document.body.appendChild(div);
        document.body.appendChild(div2);
        $('.footer-bar-box.slide.qa-ext_draggable.ui-draggable').hide();
      }
      else if(msg_data === 'add-box-bb') {
        var div = document.createElement('div');
        div.id = 'blackout-top-bb';
        document.body.appendChild(div);
        $('.footer-bar-box.slide.qa-ext_draggable.ui-draggable').hide();
      }
    }
  } 
);

//
// init
//
// descr - initializes UI elements on the page
global.init = function() {
  var template = null;
  var el       = null;
  var context  = getContext();
  console.log(context);
  
  global.loadTemplate(context);

  setTimeout( () => {
    console.log('inside firsttimeout..');
    exec(global.addToPage);
    setTimeout( () => {
      exec(function() {
          // window.addBugToThePage = function(folderType, itemType, courseTag, webNumber, tagsToAdd) {
        console.log('inside of second timeout');
        console.log(window.addBugToThePage);
      window.addBugToThePage(
        "Content QA",
        "Bug",
        "AD12-105",
        "04",
        ['zzz', 'zzzzzzz', 'zzzzzzzzzzzzzzzzzzzzz']
      );
      }, 1000);
    });
  }, 5000);
}

  // global.addItem = function(folderType, itemType, courseTag, webNumber, tagsToAdd) {


global.init();

// Executing a script in the context of the page
function exec (fn) {
   var script = document.createElement('script');
   script.setAttribute("type", "application/javascript");
   script.textContent = '(' + fn + ')();';
   document.documentElement.appendChild(script); // run the script
   document.documentElement.removeChild(script); // clean up
}

})(QA_HELPER_JQUERY, QA_HELPER_GLOBAL);




// //
// //  The Next, Previous, and Select Slide functions don't work if they are scoped
// //  because they need to access the native functions on the slide page.
// //
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//      // console.log(request);
//     var msg    = request.message;
//     var msg_data    = request.data;
    
//     // don't listen if there was no message attribute
//     if (!msg) {
//       throw "Message received, but there was no message attribute!";
//       return;
//     }
//     else if(msg === 'prev'){
//       prev_slide();
//     }
//     else if(msg === 'next'){
//       next_slide();
//     } 
//   });