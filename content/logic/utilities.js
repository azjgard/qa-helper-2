
(function($, global) {

//
// getCurrentSlide
//
// @return - a function that,
// when executed, will grab the current slide ID from the page
global.getCurrentSlide = function() {
  
  var getID = function() {
    var $btn_support = $("#btn-support");
    // console.log($btn_support);

    // click the question mark button on navigation menu to change the slideID
    // click again to close the popup modal
    $btn_support.click(); 
    $btn_support.click();

    // grab slide information
    var full_reference_id = $("div#lightboxBody>p:nth-of-type(2)").text().slice(0, -1);
    var scoName = $('#scoName').text();

    // **** DEPRECATED ****
    // have user copy slide info
    // prompt("Press Ctrl+C to copy to clipboard", full_reference_id + " --- " + scoName); 


    // return the information about the current slide
    return full_reference_id + " --- " + scoName;
  }

  return getID();
}

//
// saveCoursesToStorage
//
// descr - saves new slide course and web information to chrome local storage 
// @params
//    tab - blackboard course page tab information from Chrome (currently unused)
global.saveCoursesToStorage = function(tab){
  // console.log('save-in-storage');
  //get course name and webs within it
  var descriptions = document.getElementsByClassName('vtbegenerated');
  var course_name = document.querySelector('span#pageTitleText>span').textContent; //e.g. Course AD-102
  var values = [];

  //get new slides from local storage, add more, and upload new copy of local storage 
  chrome.storage.local.get(function(storage){
    for (var i = 0; i < descriptions.length; i++) {
        var txt = descriptions[i].textContent; 

        var obj = {
            course: course_name.trim(),
            title: txt.split(/-\s\d{4,}/)[0].trim(),
            webNumber: txt.match(/\d{2}/)[0],
            link: getUncleLink(descriptions[i])
        };
        values.push(obj);
        getUncleLink(descriptions[i]); //do we need this?
    }

    function getUncleLink(el) {
        return el
                .parentNode
                .parentNode
                .getElementsByTagName('a')[0]
                .href;    
    }

    //if no courses have been uploaded yet, create object for them and set them in the object
    if(!storage.hasOwnProperty('bb_courses')){
      storage['bb_courses'] = {};    
    }
    storage.bb_courses[course_name] = values;
    
    //set new storage
    chrome.storage.local.set(storage);
    //reset the global variable courseNavData to newly uploaded slides
    global.getCourseNavData();
  });
}

//
// getCourseNavData
//
// descr - get's course and web information for new slides 
global.getCourseNavData = function(){
  chrome.storage.local.get(function(storage){
    global.courseNavData = storage.bb_courses;
  });
}

})(QA_HELPER_JQUERY, QA_HELPER_GLOBAL);
