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

// 
// generateTemplate
//
// @param templateObject - an object with the following structure:
//
//      title : string,
//      buttons : [
//        {
//          text    : string,
//          id      : string,
//          hotkey  : string,
//          classes : [string, string]
//        },
//      ],
//      showCloseButton: boolean
//    }
//
// descr - using the templateObject provided, will return
// a string of HTML that can be used on the DOM to create
// the user interface for the page
function generateTemplate(templateObject) {
  var str = '<div class="footer-bar-box slide draggable">';
      str +=  '<div class="grabbable group">';
      str +=    '<h2>' + templateObject.title + '</h2>';

  if (templateObject.showCloseButton) {
    str += '<button id="hide-qa-helper">X</button>';
  }

  str +=  '</div>';
  str += ' <div id="footer-bar">';

  for (var i = 0; i < templateObject.buttons.length; i++) {
    var btn = templateObject.buttons[i];

    str += '<div class="footer-button';

    if (btn.classes) {
      str += ' ';
      for (var c = 0; c < btn.classes.length; c++) {
        str += btn.classes[c];
        str += c === btn.classes.length - 1 ? '' : ' ';
      }
      str += '"';
    }
    else {
      str += '"';
    }

    if (btn.id) { str += ' id="' + btn.id + '"'; }

    str += '>';
    str += '<p>' + btn.text + '</p>';

    if (btn.hotkey) {
      str += '<small>hotkey: ' + btn.hotkey + '</small>';
    }

    str += '</div>';
  }

  str += '</div>';
  str += '</div>';

  return str;
}

//
// getContext
//
// descr - returns a string describing the context of the page
// that the script is currently running inside of
function getContext() {
  var loc = window.location.href;

  if (loc.includes('avondale-iol')) {
    if      (loc.match(/lmsinit\.htm/i))    { return 'old-slide';  }
    else if (/avondale-iol\/$/i.test(loc))  { return 'dr-home';    }
    else if (/avondale-iol\/\w/i.test(loc)) { return 'dr-section'; }
    else                                    { return 'dr-misc';    }
  }
  else if (/prdtfs\.uticorp\.com/i.test(loc)) {
    return 'tfs';
  }
  else if (loc.includes('uti.blackboard.com')) {
    if (/courses\/\w{1,}\/uti_bms_qa_uat\/content/i.test(loc)) {
      return 'new-slide'
    }
    else {
      return 'bb';
    }
  }
  else {
    return 'misc';
  }
}

//
// init
//
// descr - initializes UI elements on the page
function init() {
  var template = null;
  var el       = null;
  var con      = getContext();

  if (con === 'tfs') {
    template = {
      title   : 'Team Foundation Server',
      buttons : [
        {
          text    : 'Jump to Kanban',
          hotkey  : 'Ctrl+Shift+S'
        },
        {
          text    : 'Settings',
          classes : ['fee', 'fie', 'fo', 'fum'],
          id      : 'qa-ext_settings',
          hotkey  : 'Ctrl+Shift+S'
        }
      ],
      showCloseButton: true
    };
  }
  else if (con === 'old-slide') {
    template = {
      title : 'Old Slide',
      buttons : [
        {
          text   : 'Run Comparison',
          id     : 'qa-ext_run',
          hotkey : 'none'
        },
        {
          text   : 'Settings',
          id     : 'qa-ext_settings',
          hotkey : 'none'
        },
      ],
      showCloseButton: false
    }
  }
  else if (con === 'new-slide') {
    template = {
      title : 'New Slide',
      buttons : [
        {
          text   : 'Run Comparison',
          id     : 'qa-ext_run',
          hotkey : 'none'
        },
        {
          text   : 'Settings',
          id     : 'qa-ext_settings',
          hotkey : 'none'
        },
      ],
      showCloseButton: false
    };
  }
  else if (con === 'dr-home' || con === 'dr-section' || con === 'dr-misc') {
    template = {
      title   : 'DR Site',
      buttons : [
        {
          text : 'No buttons here',
        }
      ],
      showCloseButton: true
    };
  }
  else if (con === 'bb') {
    template = {
      title   : 'Blackboard LMS',
      buttons : [
        {
          text   : 'Navigate to Course',
          hotkey : 'none'
        },
        {
          text   : 'Settings',
          hotkey : 'none'
        },
      ],
      showCloseButton: true
    };
  }
  else if (con === 'misc') {
    template = {
      title   : 'Miscellaneous Page',
      buttons : [
        {
          text : 'No buttons here',
        }
      ],
      showCloseButton: true
    };
  }

  if (template !== null) {
    el           = document.createElement('div');
    el.className = 'null-container';
    el.innerHTML = generateTemplate(template);

    document.body.appendChild(el);

    // make sure proper elements can be dragged around
    $('.draggable').draggable({ handle: '.grabbable' });
  }
}

init();
