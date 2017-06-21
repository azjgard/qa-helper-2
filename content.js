// ** CONTENT SCRIPT - NO API ACCESS **

/*
	- Content scripts have access to the page but don't have access to the other Chrome APIs
	- Background scripts don't have access to the page but have access to every Chrome API
*/

// Format for the incoming request object
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
  //       ]
  // }

console.log('the extension has loaded');


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    var message = request.message;
    var data = request.data;

    console.log(data);

    // console.log("sender", sender);
    // console.log("sendResponse", sendResponse);
    // console.log('data', data);
    // console.log('message', message);

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

var runQA       = document.createElement('button');
runQA.id        = 'run-qa-helper';
runQA.innerHTML = "Run QA Helper";

document.body.appendChild(runQA);

document.getElementById('run-qa-helper').addEventListener('click', function() {
  console.log('clicked');
  chrome.runtime.sendMessage({ message : 'run' });
});
