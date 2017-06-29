(function($, global) {
  var courseNavData =  
   [
     {"title":"Web01 - Analog Circuits","webNumber":"01","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228336_1"},
     {"title":"Web02 - Digital Circuits","webNumber":"02","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228381_1"},
     {"title":"Web04 - Resistor","webNumber":"04","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228338_1"},
     {"title":"Web07 - Distributors and Ignition Systems","webNumber":"07","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228348_1"},
     {"title":"Web10 - Wire Harness, Switches, and Ignition Coils","webNumber":"10","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228350_1"},
     {"title":"Web11 - Position Sensors","webNumber":"11","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228351_1"},
     {"title":"Web12 - Pickup Coil Sensor","webNumber":"12","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228352_1"},
     {"title":"Web13 - Theory, Types, and Applications of Semiconductors","webNumber":"13","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_241370_1"},
     {"title":"Web17 - Zener Diode Operation","webNumber":"17","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228356_1"},
     {"title":"Web18 - Rectifier Modes of Operation","webNumber":"18","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228357_1"},
     {"title":"Web19 - Types and Operation of Transistors","webNumber":"19","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228358_1"},
     {"title":"Web21 - Sensor Applications","webNumber":"21","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228370_1"},
     {"title":"Web22 - Types of Temperature Sensors","webNumber":"22","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228371_1"},
     {"title":"Web23 - NTC Thermistors","webNumber":"23","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228372_1"},
     {"title":"Web24 - PTC Thermistors","webNumber":"24","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228373_1"},
     {"title":"Web26 - Pressure and Variable Resistance Sensors","webNumber":"26","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228375_1"},
     {"title":"Web28 - Speed Sensors","webNumber":"28","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228377_1"},
     {"title":"Web30 - O2 Sensors","webNumber":"30","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228379_1"},
     {"title":"Web31 - Oil Pressure Warning System","webNumber":"31","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228380_1"},
     {"title":"Web32 - Fuel Level Sender Circuit","webNumber":"32","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228382_1"},
     {"title":"Web34 - Control Modules","webNumber":"34","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228384_1"},
     {"title":"Web35 - Multiplex Circuits","webNumber":"35","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228385_1"},
     {"title":"Web36 - Pull up Pull Down Circuits","webNumber":"36","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228386_1"},
     {"title":"Web37 - Diagnostic Exercise Amperage","webNumber":"37","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228387_1"},
     {"title":"Web38 - Diagnostic Exercise Resistance","webNumber":"38","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228388_1"},
     {"title":"Web39 - Diagnostic Exercise Voltage","webNumber":"39","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228389_1"},
     {"title":"Web40 - Diagnostic Exercise Voltage Drop","webNumber":"40","link":"https://uti.blackboard.com/webapps/scor-scormengine-BBLEARN/delivery?action=launchPackage&course_id=_3607_1&content_id=_228390_1"}
   ];

function thisIsARandomFunction() {
  alert('HELLO THERE WORLD!');
}
function jumpToKanban() {
  window.location.href = 'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs/board/Features?' + 'scrollToQA=true'
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
  $('input#btn-prev').removeAttr('disabled').click()
}

function nextSlide() {
  $('input#btn-next').removeAttr('disabled').click()
}

function settingsMenu() {
  alert("settings");
}

function toggleBtnCompression() {
  if ($(this).hasClass('compressed')) {
    $(this).removeClass('compressed');
    $('.qa-ext_popup')
    .css('display', 'none')
    .html('<button id="qa-ext_popup-trigger"></button');
  }
  else {
    $(this).addClass('compressed');
    $('.qa-ext_popup').fadeIn();
  }
}

function jumpToWeb() {

   var webSelectString = '';

   // grab first 33 characters if it's longer than that.
    $.each(courseNavData, function(index, web) {
      var title = web.title.length > 34 ?
                  web.title.substring(0, 31) + '..' :
                  web.title;
      webSelectString+='<option>' + title + '</option>';
    });

    var htmlString = 
                    '<h3>Course #</h3>'+
                    '<select class="course-select">'+
                      '<option selected>Course 105</option>'+
                    '</select>'+
                    '<h3>Web #</h3>'+
                    '<select class="web-select">'+
                      webSelectString+
                    '</select>';

   configurePopup(htmlString, 'Jump');
}

function configurePopup(popupHtml, triggerText) {
   $('.qa-ext_popup').prepend(popupHtml);
   $('#qa-ext_popup-trigger').html(triggerText);
}


function run() {
  console.log('sending the run message!!');
  chrome.runtime.sendMessage({message:'run'});
}

function jumpToQA(){
  $('.agile-content-container.scrollable').scrollLeft(3100);
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
        listener: jumpToKanban
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
      },
      {
        text: 'Jump to Web ->',
        id : 'qa-ext_jump-to-web',
        hotkey: 'none',
        listener: jumpToWeb,
        popup: true,
        popupTrigger: function() {
          var number = $('.web-select').val().match(/\d{2,}/)[0];

          $.each(courseNavData, function(index, web) {
            if (parseInt(web.webNumber) === parseInt(number)) {
              window.location.href = web.link;
              return;
            }
          });
        }
      }
    ],
    listeners : [],
    showCloseButton: true
  },
  "bb-login": {
    alias: "bb"
  }
}

global.loadTemplate = function(context) {
  return new Promise(function(resolve, reject) {
    var template = null;
    var templateUT = null;

    // don't load a template if it's a miscellaneous page
    if (context !== 'misc') {
      template = templateObjects[context];

      // load the alias instead if it is present
      if (template.alias) {
        template = templateObjects[template.alias];
      }

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

        if (btn.popup) {
          $('#'+btn.id).on('click', toggleBtnCompression);
          if (btn.popupTrigger) {
            $('#qa-ext_popup-trigger').on('click', btn.popupTrigger);
          }
        }
      }
    }

    resolve(context);
  });
}

})(QA_HELPER_JQUERY, QA_HELPER_GLOBAL);