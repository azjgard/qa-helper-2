(function($, global) {

var dr_storage;
function initializeDr() {
  dr_storage = global.initializeDrData();
  // dr_storage[bb_courses] = global.initializeBbData();
}
initializeDr();
console.log(dr_storage);

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
  console.log(slideInfo);
  chrome.runtime.sendMessage(data);
}

function prevSlide() {
  $('input#btn-prev').removeAttr('disabled').click()
}

function nextSlide() {
  $('input#btn-next').removeAttr('disabled').click()
}

// function settingsMenu() {
//   alert("This button does not have any functionality yet");
// }

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
    // console.log('global.courseNavData: ', global.courseNavData);
   var webSelectString = '';
   var webCourse = '';

   // grab first 33 characters if it's longer than that.
  for (var key in global.courseNavData) {
    
    
    $.each(global.courseNavData[key], function(index, web){
      // console.log(web);

      var title = web.title;
                          // .length > 34 ?
                          //   web.title.substring(0, 31) + '..' :
                          //   web.title;
        webSelectString+='<option class="jump-to-web-webName" title="' + web.course + " --- " + web.title + '">' + title + '</option>';
    });
    // console.log(global.courseNavData[key][0]);
    
    webCourse += '<option>' + global.courseNavData[key][0].course + '</option>'

  }
  // console.log(webCourse);
  // console.log(webSelectString);


  var htmlString = 
                  '<h3>Course #</h3>'+
                  '<select id="jump-to-web-courseName" class="course-select" onchange="qa_ext_filterCourseNavData()">'+
                    webCourse +
                  '</select>'+
                  '<h3>Web #</h3>'+
                  '<select id="jump-to-web-webName" class="web-select">'+
                    webSelectString+
                  '</select>';

  configurePopup(htmlString, 'Jump');

}

function configurePopup(popupHtml, triggerText) {
  
  global.executeInPageContext(function() {
    setTimeout(function(){
      qa_ext_filterCourseNavData = function(){
        
        var course_choose = document.querySelector('#jump-to-web-courseName');
        var web_box = document.querySelector('#jump-to-web-webName');
        var web_choose = document.querySelectorAll('.jump-to-web-webName');

        // console.log(web_choose);
        web_box.value = null;
        for (var i = 0; i < web_choose.length; i++) {
          web_choose[i].style.display = "block";
          if(course_choose.value !== web_choose[i].getAttribute("title").match(/(.+)\s---\s/)[1]){
            web_choose[i].style.display = 'none';
          }
        }
      }
      qa_ext_filterCourseNavData();
      
    }, 50);
  });

   $('.qa-ext_popup').prepend(popupHtml);
   $('#qa-ext_popup-trigger').html(triggerText);
}

function copyBug(){
  alert("This feature is not yet functional");
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
        text    : 'Copy Bug',
        hotkey  : 'ctrl+shift+s',
        id: 'qa-ext_jump-to-kanban',
        listener: copyBug
      }
      // ,
      // {
      //   text    : 'Settings',
      //   classes : ['fee', 'fie', 'fo', 'fum'],
      //   id      : 'qa-ext_settings',
      //   hotkey  : 'Ctrl+Shift+S',
      //   listener: thisIsARandomFunction
      // }
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
      }
      // ,
      // {
      //   text    : 'Settings',
      //   classes : ['fee', 'fie', 'fo', 'fum'],
      //   id      : 'qa-ext_settings',
      //   hotkey  : 'Ctrl+Shift+S',
      //   listener: thisIsARandomFunction
      // }
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
      }
      // ,
      // {
      //   text   : 'Settings',
      //   id     : 'qa-ext_settings',
      //   hotkey : 'none',
      //   listener: run
      // }
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
      // {
      //   text   : 'Settings',
      //   id     : 'qa-ext_settings',
      //   hotkey : 'none',
      //   listener: settingsMenu
      // },
      {
        text   : '>',
        id     : 'qa-ext_next',
        hotkey : 'none',
        listener: nextSlide
      }
    ],
    showCloseButton: false
  },

  // "dr": {
  //   title   : 'DR Site',
  //   buttons : [
  //     {
  //       text : 'Run Comparison',
  //       id : 'qa-ext_test-run-comparison',
  //       hotkey: 'none',
  //       listener: run
  //     }
  //   ],
  //   listeners : [],
  //   showCloseButton: true
  // },

  "bb": {
    title   : 'Blackboard LMS',
    buttons : [
      // {
      //   text : 'Run Comparison',
      //   id : 'qa-ext_test-run-comparison',
      //   hotkey: 'none',
      //   listener: run
      // },
      {
        text: 'Jump to Web',
        id : 'qa-ext_jump-to-web',
        hotkey: 'none',
        listener: jumpToWeb,
        popup: true,
        popupTrigger: function() {
          var number = $('.web-select').val().match(/\d{2,}/)[0];
          var course = document.querySelector('#jump-to-web-courseName');
          for(var key in global.courseNavData) {
            
            $.each(global.courseNavData[key], function(index, web) {
              if (parseInt(web.webNumber) === parseInt(number) && web.course === course.value) {
                // console.log('courses match: ', web.course, course.value);
                
                  var html_course = course.value.match(/\w{2}-\d{3}/);
                  var web_select = document.querySelector('#jump-to-web-webName');
                  var web_title = web_select.options[web_select.selectedIndex].getAttribute('title').match(/---\sWeb\d{2}\s-\s(.+)/)[1];
                  
                  if(dr_storage.dr_courses.hasOwnProperty(html_course)){
                    if(dr_storage.dr_courses[html_course].hasOwnProperty(web_title)){
                      alert("sending");
                      chrome.runtime.sendMessage({message: 'to-old-slide', data: dr_storage.dr_courses[html_course][web_title].full_url});
                    }
                  }

                window.location.href = web.link;




      // for (var i = 0; i < web_choose.length; i++) {
        //   document.querySelector('#jump-to-web-webName').addEventListener('change', function(){
        //         console.log(storage);
        //         console.log(storage.dr_courses[document.querySelector('#jump-to-web-webName').value.match(/\w{2}-\d{3}/)[0]]);
        //         console.log(storage.dr_courses[document.querySelector('#jump-to-web-courseName').value.match(/\w{2}-\d{3}/)[0]][document.querySelector('#jump-to-web-webName').value.match(/Web\d{2}\s{1}-\s{1}(.+)/)[1]]);
        //   });
        // }
      
                
                return;
              }
            });
          
          };
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

