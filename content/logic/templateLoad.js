(function($, global) {

function thisIsARandomFunction() {
  alert('HELLO THERE WORLD!');
}
function anotherThing() {
  alert('this is another thing');
}


function addBugButton() {
  var slideInfo = global.getCurrentSlide();
  data = {
    "message": "bug",
    "data"   : slideInfo
  };
  chrome.runtime.sendMessage(data);
}

function prevSlide() {
  data = {
    "message": "prev",
    "data"   : ''
  };
  chrome.runtime.sendMessage(data);
}

function nextSlide() {
  data = {
    "message": "next",
    "data"   : ''
  };
  chrome.runtime.sendMessage(data);
}

function settingsMenu() {
  alert("settings");
}


function run() {
  console.log('sending the run message!!');
  chrome.runtime.sendMessage({message:'run'});
}

function jumpToQA(){
  chrome.runtime.sendMessage({message:'Jump to QA'})
}

// TODO: add functionality to account for hotkeys
// var ctrlPressed = false;
// var shiftPressed = false;

// $(window).keyDown(function(ev) {
//   if      (ev.which === 17) { ctrlPressed  = true; }
//   else if (ev.which === 16) { shiftPressed = true; }
// })
// $(window).keyUp(function(ev) {
//   if      (ev.which === 17) { ctrlPressed  = false; }
//   else if (ev.which === 16) { shiftPressed = false; }
// })

// var hotkey_addBug          = 65;  // A
// var hotkey_nextSlide       = 190; // .
// var hotkey_prevSlide       = 188; // ,
// var hotkey_getCurrentSlide = 83;  // s

var templateObjects = {
  "tfs_log": {
    title   : 'Team Foundation Server',
    buttons : [
      {
        text    : 'Jump to Kanban',
        hotkey  : 'ctrl+shift+s',
        id: 'qa-ext_jump-to-kanban',
        listener: anotherThing
      },
      {
        text    : 'Settings',
        classes : ['fee', 'fie', 'fo', 'fum'],
        id      : 'qa-ext_settings',
        hotkey  : 'Ctrl+Shift+S',
        listener: thisIsARandomFunction
      }
    ],
    showCloseButton: true
  },
  "tfs_board": {
    title   : 'Team Foundation Server',
    buttons : [
      {
        text    : 'To QA',
        hotkey  : 'None',
        id: 'qa-ext_to-qa',
        listener: jumpToQA
      },
      {
        text    : 'Settings',
        classes : ['fee', 'fie', 'fo', 'fum'],
        id      : 'qa-ext_settings',
        hotkey  : 'Ctrl+Shift+S',
        listener: thisIsARandomFunction
      }
    ],
    showCloseButton: true
  },
  "old-slide": {
    title : 'Old Slide',
    buttons : [
      {
        text   : 'Run Comparison',
        id     : 'qa-ext_run',
        hotkey : 'none',
        listener: run
      },
      {
        text   : 'Settings',
        id     : 'qa-ext_settings',
        hotkey : 'none',
        listener: run
      }
    ],
    showCloseButton: false
  },

  "new-slide": {
    title : 'New Slide',
    buttons : [
      {
        text   : '<',
        id     : 'qa-ext_prev',
        hotkey : 'none',
        listener: prevSlide
      },
      {
        text   : 'Run Comparison',
        id     : 'qa-ext_run',
        hotkey : 'none',
        listener: run
      },
      {
        text    : 'Add Bug',
        id      : 'qa-ext_bug',
        hotkey  : 'none',
        listener: addBugButton
      },
      {
        text   : 'Settings',
        id     : 'qa-ext_settings',
        hotkey : 'none',
        listener: settingsMenu
      },
      {
        text   : '>',
        id     : 'qa-ext_next',
        hotkey : 'none',
        listener: nextSlide
      }
    ],
    showCloseButton: false
  },

  "dr": {
    title   : 'DR Site',
    buttons : [
      {
        text : 'Run Comparison',
        id : 'qa-ext_test-run-comparison',
        hotkey: 'none',
        listener: run
      }
    ],
    listeners : [],
    showCloseButton: true
  },

  "bb": {
    title   : 'Blackboard LMS',
    buttons : [
      {
        text : 'Run Comparison',
        id : 'qa-ext_test-run-comparison',
        hotkey: 'none',
        listener: run
      }
    ],
    listeners : [],
    showCloseButton: true
  },

}

global.loadTemplate = function(context) {
  return new Promise(function(resolve, reject) {
    var template = null;
    var templateUT = null;

    // don't load a template if it's a miscellaneous page
    if (context !== 'misc') {
      template = templateObjects[context];
      templateUI = global.generateTemplate(template);

      // add the UI to the document
      $('body').append('<div class="null-container">')
               .append(templateUI)
               .append('</div>');

      $('.qa-ext_draggable').draggable({ handle: '.grabbable' });

      // add the listeners and hotkeys to the buttons
      for (var i = 0; i < template.buttons.length; i++) {
        var btn = template.buttons[i];

        if (btn.id && btn.listener) {
          $('#' + btn.id).on('click', btn.listener);
        }
        else {
          if (!btn.id) {
            throw new Error("The button " + btn.text + " has no ID to reference it by!");
          }
          if (!btn.listener) {
            throw new Error("The button " + btn.text + " has no listener function attached!");
          }
        }
      }
    }

    resolve(context);
  });
}

})(QA_HELPER_JQUERY, QA_HELPER_GLOBAL);