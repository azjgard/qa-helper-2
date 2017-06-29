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
    else if (msg === 'run') { //this message will be sent from draggable qa bar
      console.log('received run message');
        //add divs to the screen to highlight text
        for (var i = 0; i < msg_data.length; i++) {
            var div = document.createElement('div');
            if(msg_data[i].matched){
              div.style.backgroundColor = "green";
            } else {
              div.style.backgroundColor = "red";
            }
            div.style.opacity = ".5";
            div.style.height = msg_data[i].height + 'px';
            div.style.width = msg_data[i].width + 'px';
            div.style.top = msg_data[i].top + 'px';
            div.style.left = msg_data[i].left + 'px';
            div.style.position = 'absolute';
            div.classList.add('qa2-highlighted-word');
            div.style.pointerEvents = "none";
            document.body.appendChild(div); 
        }
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