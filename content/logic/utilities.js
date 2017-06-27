(function($, global) {

//
// getContext
//
// descr - returns a string describing the context of the page
// that the script is currently running inside of
global.getContext = function() {
  var loc = window.location.href;

  if (loc.includes('avondale-iol')) {
    if (loc.match(/lmsinit\.htm/i)) { return 'old-slide'; }
    else                            { return 'dr';        }
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
global.generateTemplate = function(templateObject) {
  var str = '<div class="footer-bar-box slide qa-ext_draggable">';
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

})(QA_HELPER_JQUERY, QA_HELPER_GLOBAL);