(function($, global) {


//
// Message Listener
//
// descr - listen to messages from the background.
// For obvious reasons, this does not need to be a
// member of the global QA variable.
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(request);
    var msg    = request.message;
    var msg_data    = request.data;
    
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
    else if (msg === 'bug') { //sent from Add Bug button on new slides
      console.log(msg_data);
        global.addBugToTFS(msg_data)
          .then(function(data){
            console.log("bug window open!");
        });
    }
    else if(msg === 'prev'){
      global.prev_slide(window);
    }
    else if(msg === 'next'){
      global.next_slide(window);
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
  var context  = global.getContext();

  global.loadTemplate(context);
}

global.init();


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