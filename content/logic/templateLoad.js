(function($, global) {

    var pat1 = /\/\w{2}-\d{3}\.html/;
    var pat2 = /\/\w{2}-\d{3}\/\w+/;
    var pat3 = /\/index\.html/;
    
    chrome.storage.local.get(function(storage){
	// console.log(storage);
    });
    
    var templateObjects = {
	// "tfs_log": {
	//   title   : 'TFS',
	//   buttons : [
	//     {
	//       text    : 'Copy Bug',
	//       B
	//       hotkey  : 'ctrl+shift+s',
	//       id: 'qa-ext_jump-to-kanban',
	//       listener: copyBug
	//     }
	//     // ,
	//     // {
	//     //   text    : 'Settings',
	//     //   classes : ['fee', 'fie', 'fo', 'fum'],
	//     //   id      : 'qa-ext_settings',
	//     //   hotkey  : 'Ctrl+Shift+S',
	//     //   listener: thisIsARandomFunction
	//     // }
	//   ],
	//   showCloseButton: true
	// },
	"tfs_board": {
	    title   : 'TFS Board',
	    buttons : [
		{
		    text    : 'Jump to QA <i class="fa fa-external-link"></i>',
		    // hotkey  : 'None',
		    id: 'qa-ext_to-qa',
		    listener: jumpToQA
		}
	    ],
	    // showCloseButton: true
	},
	"old-slide": {
	    title : 'Old Slide',
	    buttons : [
		{
		    text   : '<i class="fa fa-check-circle-o" title="Compare Slides"></i>',
		    id     : 'qa-ext_run',
		    // hotkey : 'none',
		    classes: ['button-icon'],
		    listener: run
		},
		{
		    text   : 'Hide Highlights',
		    id     : 'qa-ext_hide-highlights',
		    classes: ['button-icon-sibling']
		}
	    ],
	    showCloseButton: false
	},

	"new-slide": {
	    title : 'New Slide',
	    buttons : [
		{
		    text   : '<i class="fa fa-arrow-left" title="Previous Slide"></i>',
		    id     : 'qa-ext_prev',
		    // hotkey : 'none',
		    classes: ['button-icon'],
		    listener: prevSlide
		},
		{
		    text   : '<i class="fa fa-check-circle-o" title="Compare Slides"></i>',
		    id     : 'qa-ext_run',
		    // hotkey : 'none',
		    classes: ['button-icon'],
		    listener: run
		},
		{
		    text    : '<i class="fa fa-bug" title="Add Bug"></i>',
		    id      : 'qa-ext_bug',
		    // hotkey  : 'none',
		    classes: ['button-icon'],
		    listener: addBugButton
		},
		{
		    text   : '<i class="fa fa-arrow-right" title="Next Slide"></i>',
		    id     : 'qa-ext_next',
		    // hotkey : 'none',
		    classes: ['button-icon'],
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
	    title   : 'Blackboard',
	    buttons : [
		// {
		//   text : 'Run Comparison',
		//   id : 'qa-ext_test-run-comparison',
		//   hotkey: 'none',
		//   listener: run
		// },
		{
		    text: 'Jump to Web <i class="fa fa-external-link"></i>',
		    id : 'qa-ext_jump-to-web',
		    // hotkey: 'none',
		    listener: jumpToWeb,
		    popup: true,
		    popupTrigger: jumpPopup
		}
	    ],
	    listeners : [],
	    // showCloseButton: true
	},
	"bb-login": {
	    title   : 'Blackboard',
	    buttons : [
		{
		    text    : 'Login to use the tool',
		    // hotkey  : 'None',
		    id: 'qa-ext_login',
		    classes: ['unclickable-button']
		}
	    ],
	    // showCloseButton: true
	}
    };





    //************************************************************
    //***************** BUTTON LISTENERS *************************
    //************************************************************




    //
    // jumpPopup
    //
    // descr - navigates user to selected webs in old and new sites
    function jumpPopup() {
	//grab web number and course
	var number = $('.web-select').val().match(/\d{2,}/)[0];
	var course = document.querySelector('#jump-to-web-courseName');


	for(var key in global.courseNavData) {
	    $.each(global.courseNavData[key], function(index, web) {

		//find the link that matches the selected course and web
		if (parseInt(web.webNumber) === parseInt(number) && web.course === course.value) {
		    var html_course = course.value.match(/\w{2}-\d{3}/);
		    var web_select = document.querySelector('#jump-to-web-webName');
		    var web_title = web_select.options[web_select.selectedIndex].getAttribute('title').match(/---\sWeb\d{2}\s-\s(.+)/)[1];

		    //send message to dr site to open matching old slide
		    if(global.dr_storage.dr_courses.hasOwnProperty(html_course)){
			if(global.dr_storage.dr_courses[html_course].hasOwnProperty(web_title)){
			    chrome.runtime.sendMessage({message: 'to-old-slide', data: "http://" + global.dr_storage.dr_courses[html_course][web_title].full_url});
			}
		    }

		    //open new slide
		    window.location.href = web.link;
		    return;
		}
	    });
	    
	};
    }

    //
    // thisIsARandomFunction
    //
    // descr - thisIsARandomFunction
    function thisIsARandomFunction() {
	alert('HELLO THERE WORLD!');
    }

    //
    // jumpToKanban
    //
    // descr - changes page to tfs-board focused on QA
    function jumpToKanban() {
	window.location.href = 'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs/board/Features?' + 'scrollToQA=true'
    }

    //
    // addBugButton
    //
    // descr - get's slide information and sends it to TFS to add a bug
    function addBugButton() {
	var slideInfo = global.getCurrentSlide();
	data = {
	    "message": "bug",
	    "data"   : slideInfo
	};
	// console.log(slideInfo);
	chrome.runtime.sendMessage(data);
    }

    //
    // prevSlide
    //
    // descr - loads previous slide in blackboard courses
    function prevSlide() {
	$('input#btn-prev').removeAttr('disabled').click()
    }

    //
    // nextSlide
    //
    // descr - loads next slide in blackboard courses
    function nextSlide() {
	$('input#btn-next').removeAttr('disabled').click()
    }

    //
    // settingsMenu
    //
    // descr - settings menu for future use
    // function settingsMenu() {
    //   alert("This button does not have any functionality yet");
    // }

    //
    // toggleBtnCompression
    //
    // descr - opens and closes the popup window on blackboard "jump to web" button
    function toggleBtnCompression() {
	if ($(this).hasClass('compressed')) {
	    $(this).removeClass('compressed');
	    $('.qa-ext_popup')
		.css('display', 'none');
	    $('.qa-ext_popup>div').remove();
	}
	else {
	    $(this).addClass('compressed');
	    $('.qa-ext_popup').fadeIn();
	}
    }

    //
    // jumpToWeb
    //
    // descr - fills dropdowns under "jump to web" button with course and web choices
    // that allow users to quickly navigate to their courses
    function jumpToWeb() {
	var webSelectString = '';
	var webCourse = '';
	// console.log(global.courseNavData);
	for (var key in global.courseNavData) {
	    $.each(global.courseNavData[key], function(index, web){
		var title = web.title; // .length > 34 ?
		//  web.title.substring(0, 31) + '..' :
		//  web.title;
		webSelectString+='<option class="jump-to-web-webName" title="' + web.course + " --- " + web.title + '">' + title + '</option>';
	    });
	    webCourse += '<option>' + global.courseNavData[key][0].course + '</option>'
	}

	var htmlString = 
		'<div>'+
		'<h3>Course #</h3>'+
		'<select id="jump-to-web-courseName" class="course-select" onchange="qa_ext_filterCourseNavData()">'+
		webCourse +
		'</select>'+
		'<h3>Web #</h3>'+
		'<select id="jump-to-web-webName" class="web-select">'+
		webSelectString+
		'</select>'+
		'</div>';

	configurePopup(htmlString, 'Jump');
    }

    //
    // configurePopup
    //
    // descr - injects function into webpage that filters "jump to web" dropdowns 
    // with webs that are relevant to the chosen course
    function configurePopup(popupHtml, triggerText) {
	global.executeInPageContext(function() {
	    setTimeout(function(){
		qa_ext_filterCourseNavData = function(){
		    
		    //grab select boxes and option tags
		    var course_choose = document.querySelector('#jump-to-web-courseName');
		    var web_box = document.querySelector('#jump-to-web-webName');
		    var web_choose = document.querySelectorAll('.jump-to-web-webName');

		    //if the box is open
		    if(web_box){
			web_box.value = null;
			for (var i = 0; i < web_choose.length; i++) {
			    web_choose[i].style.display = "block";
			    if(course_choose.value !== web_choose[i].getAttribute("title").match(/(.+)\s---\s/)[1]){
				web_choose[i].style.display = 'none';
			    }
			}
		    }

		}
		qa_ext_filterCourseNavData();
	    }, 50);
	});

	//add popup to page
	$('.qa-ext_popup').prepend(popupHtml);
	$('#qa-ext_popup-trigger').html(triggerText);
    }

    //
    // copyBug
    //
    // descr - this will copy a bug to another bug in TFS
    function copyBug(){
	alert("This feature is not yet functional");
    }

    //
    // run
    //
    // descr - sends message to the old slide and new slide and runs 
    // a comparison of the text on the slides via 3rd Party OCR
    function run() {
	// console.log('sending the run message!!');
	chrome.runtime.sendMessage({message:'run'});
    }

    //
    // jumpToQA
    //
    // descr - moves Kanban board in TFS to QA section
    function jumpToQA(){
	$('.agile-content-container.scrollable').scrollLeft(3100);
    }




    //************************************************************
    //***************** END BUTTON LISTENERS *********************
    //************************************************************








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









    //
    // loadTemplate
    //
    // descr - loads QA-Helper tool on the page
    // @param 
    //    context - name of the site to add button on (e.g. 'tfs_log')
    global.loadTemplate = function(context) {
	return new Promise(function(resolve, reject) {
	    var template = null;
	    var templateUT = null;

	    // don't load a template if it's a miscellaneous page
	    if (context !== 'misc' && templateObjects[context] !== undefined) {
		template = templateObjects[context];

		// load the alias instead if it is present
		if (template.alias) { //throws error for pages that aren't misc but don't have a button defined
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

		    //set listener
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

		    //set popup and listener for popup
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
    //          classes : [string, string],
    //          listener: function reference,
    //          popup: boolean,
    //          popupTrigger: function reference
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
	str += '<div class="qa-ext_popup"><button id="qa-ext_popup-trigger"></button></div>';
	str += '</div>';

	return str;
    }



})(QA_HELPER_JQUERY, QA_HELPER_GLOBAL);
