var templateObjects = {

  "tfs": {
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
    showCloseButton: false
  },

  "dr": {
    title   : 'DR Site',
    buttons : [
      {
        text : 'No buttons here',
      }
    ],
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
    showCloseButton: true
  },

}

function loadTemplate(context) {
  var template = null;

  // don't load a template if it's a miscellaneous page
  if (context !== 'misc') {
    template = templateObjects[context];
    template = generateTemplate(template);

    $('body').append('<div class="null-container">')
             .append(template)
             .append('</div>');

    $('.draggable').draggable({ handle: '.grabbable' });
  }
}
