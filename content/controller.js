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
    var data    = request.data;
    
    // don't listen if there was no message attribute
    if (!msg) {
      throw "Message received, but there was no message attribute!";
      return;
    }
    else if (msg === 'run') { //this message will be sent from draggable qa bar
      console.log('received run message');
        //add divs to the screen to highlight text
        for (var i = 0; i < data.length; i++) {
            var div = document.createElement('div');
            if(data[i].matched){
              div.style.backgroundColor = "green";
            } else {
              div.style.backgroundColor = "red";
            }
            div.style.opacity = ".5";
            div.style.height = (data[i].height + 5) + 'px';
            div.style.width = (data[i].width + 5) + 'px';
            div.style.top = (data[i].top - 2.5) + 'px';
            div.style.left = (data[i].left - 2.5) + 'px';
            div.style.position = 'absolute';
            div.classList.add('qa2-highlighted-word');
            div.style.pointerEvents = "none";
            document.body.appendChild(div); 
        }
    }
    else if (msg === 'bug') { //sent from Add Bug button on new slides
      console.log(request.data);
        global.addBugToTFS(request.data)
          .then(function(data){
            
        });
    } // end else if
  } // end function
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
