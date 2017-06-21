// ** CONTENT SCRIPT - NO API ACCESS **

/*
	- Content scripts have access to the page but don't have access to the other Chrome APIs
	- Background scripts don't have access to the page but have access to every Chrome API
*/

// Format for the incoming request object
  // {
  //   "message" :
  //   "data": [
<<<<<<< HEAD
  //          {
                // height:
                // width:
                // top:
                // left:
                // word_text:
                // matched:
  //          }
  //       ]
=======
//          {
              // height:
              // width:
              // top:
              // left:
              // word_text:
              // matched:
//          }
  //   ]
>>>>>>> a2c328410f314f63c20c8c66a33542098f37d3b8
  // }

console.log('the extension has loaded');


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    var message = request.message;
    var data = request.data;

    console.log(data);

    // console.log("sender", sender);
    // console.log("sendResponse", sendResponse);
    // console.log('data', data);
    // console.log('message', message);

    //add divs to the screen to highlight text
    for (var i = 0; i < data.length; i++) {
        var green_div = document.createElement('div');
        if(data[i].matched){
          green_div.style.backgroundColor = "green";
        } else {
          green_div.style.backgroundColor = "red";
        }
        green_div.style.opacity = ".5";
        green_div.style.height = data[i].height + 5 + 'px';
        green_div.style.width = data[i].width + 5 + 'px';
        green_div.style.top = data[i].top - 2.5 + 'px';
        green_div.style.left = data[i].left - 2.5 + 'px';
        green_div.style.position = 'absolute';
        document.body.appendChild(green_div); 
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
