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
  function(request, sender, sendResponse) {
    //request has "message" key and "data" key
    request = JSON.parse(request);
    var data = request.data;
    var message = request.message;

    // console.log(request);
    // console.log(data);
    // console.log(message);

//dummy data for testing
    // data = {
    //   colors : {
    //     green : [
    //       {
    //         width : 315,
    //         height : 32,
    //         left : 300,
    //         top : 50
    //       },
    //       {
    //         width : 100,
    //         height : 100,
    //         left : 50,
    //         top : 50
    //       },
    //       {
    //         width : 100,
    //         height : 100,
    //         left : 150,
    //         top : 150
    //       },
    //     ],
    //     red : [
    //       {
    //         width : 100,
    //         height : 100,
    //         left : 300,
    //         top : 300
    //       },
    //       {
    //         width : 100,
    //         height : 100,
    //         left : 500,
    //         top : 500
    //       },
    //       {
    //         width : 100,
    //         height : 100,
    //         left : 700,
    //         top : 700
    //       },
    //     ]
    //   }
    // }; 

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