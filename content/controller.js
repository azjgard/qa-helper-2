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
