function thisIsARandomFunction() {
  alert('HELLO THERE WORLD!');
}
function anotherThing() {
  alert('this is another thing');
}


function addBugButton() {
  var slideInfo = getCurrentSlide();
  data = {
    "message": "bug",
    "data"   : slideInfo
  };
  chrome.runtime.sendMessage(data);
}

function settingsMenu() {
  alert("settings");
}

function runComparison() {
  alert("comparison");
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
  "tfs": {
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
  "old-slide": {
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
    listeners : [],
    showCloseButton: false
  },

  "new-slide": {
    title : 'New Slide',
    buttons : [
      {
        text    : 'Run Comparison',
        id      : 'qa-ext_run',
        hotkey  : 'none',
        listener: runComparison
      },
      {
        text    : 'Add Bug',
        id      : 'qa-ext_bug',
        hotkey  : 'none',
        listener: addBugButton
      },
      {
        text    : 'Settings',
        id      : 'qa-ext_settings',
        hotkey  : 'none',
        listener: settingsMenu
      },
    ],
    listeners : [],
    showCloseButton: false
  },

  "dr": {
    title   : 'DR Site',
    buttons : [
      {
        text : 'No buttons here',
      }
    ],
    listeners : [],
    showCloseButton: true
  },

  "bb": {
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
    listeners : [],
    showCloseButton: true
  },

}

function loadTemplate(context) {
  return new Promise(function(resolve, reject) {
    var template = null;
    var templateUT = null;

    // don't load a template if it's a miscellaneous page
    if (context !== 'misc') {
      template = templateObjects[context];
      templateUI = generateTemplate(template);

      // add the UI to the document
      $('body').append('<div class="null-container">')
               .append(templateUI)
               .append('</div>');

      $('.draggable').draggable({ handle: '.grabbable' });

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
