console.log('CONTROLLER.js loaded');

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    console.log(request);

    var message = request.message;
    var data    = request.data;

    console.log(data);

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
); 

//
// init
//
// descr - initializes UI elements on the page
function init() {
  var template = null;
  var el       = null;
  var context  = getContext();

  loadTemplate(context);
}

init();
