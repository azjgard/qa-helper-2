// ** CONTENT SCRIPT - NO API ACCESS **

/*
	- Content scripts have access to the page but don't have access to the other Chrome APIs
	- Background scripts don't have access to the page but have access to every Chrome API
*/

// Format for the incoming request object
  // {
  //   "message" :
  //   "data": {
  //     "colors" : {
  //       "green" : [
  //         {
  //           "width" :
  //           "height" :
  //           "left" :
  //           "top" :
  //         }
  //       ],
  //       "red" : [
  //         {
  //           "width" :
  //           "height" :
  //           "left" :
  //           "top" :
  //         }
  //       ]
  //     }
  //   }
  // }
console.log('the extension has loaded');


chrome.runtime.onMessage.addListener(
  function(data, sender, sendResponse) {
    
    var message = data.message;

    // console.log("sender", sender);
    // console.log("sendResponse", sendResponse);
    // console.log('data', data);
    // console.log('message', message);

    //add green divs to the screen to highlight text
    for (var i = 0; i < data.colors.green.length; i++) {
        var green_div = document.createElement('div');
        green_div.style.backgroundColor = "green";
        green_div.style.opacity = ".5";
        green_div.style.height = data.colors.green[i].height + 5 + 'px';
        green_div.style.width = data.colors.green[i].width + 5 + 'px';
        green_div.style.top = data.colors.green[i].top - 2.5 + 'px';
        green_div.style.left = data.colors.green[i].left - 2.5 + 'px';
        green_div.style.position = 'absolute';
        document.body.appendChild(green_div); 
    }

    //add red divs to the screen to highlight text
    for (var i = 0; i < data.colors.red.length; i++) {
        var red_div = document.createElement('div');
        red_div.style.backgroundColor = "red";
        red_div.style.opacity = ".5";
        red_div.style.height = data.colors.red[i].height + 5 + 'px';
        red_div.style.width = data.colors.red[i].width + 5 + 'px';
        red_div.style.top = data.colors.red[i].top - 2.5 + 'px';
        red_div.style.left = data.colors.red[i].left - 2.5 + 'px';
        red_div.style.position = 'absolute';
        document.body.appendChild(red_div); 
    }
  }
); 