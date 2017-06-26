function thisIsARandomFunction() {
  alert('HELLO THERE WORLD!');
}
function anotherThing() {
  alert('this is another thing');
}

// TODO: add functionality to account for hotkeys
var templateObjects = {
  "tfs": {
    title   : 'Team Foundation Server',
    buttons : [
      {
        text    : 'Jump to Kanban',
        hotkey  : 'Ctrl+Shift+S',
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

      // add the listeners to the buttons
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
