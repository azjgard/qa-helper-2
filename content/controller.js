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

      var courseTag, webNumber;
      try {
        courseTag = msg_data.match(/^\w{2,}\d{2,}-\d{3}/)[0];
        var webNumber = msg_data.match(/web\d{2,}/i)[0].match(/\d{2,}/)[0];

        executeInPageContext(function(courseTag, webNumber) {
          qa_ext_addItem(
            "Content QA",
            "Bug",
            courseTag,
            webNumber,
            ['zzz', 'zzzzzzz', 'zzzzzzzzzzzzzzzzzzzzz']
          );
        }, courseTag, webNumber);
      }
      catch (e) {
        alert('The slide reference ID is incorrectly formatted!');
      }

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

  // inject scripts that need to be in the page's world
  if (context === 'tfs_log') {
    setTimeout( () => {
      executeInPageContext(global.defineFunction_addItem);
    }, 3000);
  }
}

global.init();

// Executing a script in the context of the page
//
// NOTE: arguments should be passed as separate parameters from
// the function itself
function executeInPageContext(fn) {
    var args = '';
    if (arguments.length > 1) {
        for (var i = 1, end = arguments.length - 2; i <= end; i++) {
            args += typeof arguments[i]=='function' ? arguments[i] : JSON.stringify(arguments[i]) + ', ';
        }
        args += typeof arguments[i]=='function' ? arguments[arguments.length - 1] : JSON.stringify(arguments[arguments.length - 1]);
    }

    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')(' + args + ');';
    document.documentElement.appendChild(script); // run the script
    document.documentElement.removeChild(script); // clean up
}

})(QA_HELPER_JQUERY, QA_HELPER_GLOBAL);