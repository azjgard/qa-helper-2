
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
    };

    return getID();
  };

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
  };

  //
  // getCourseNavData
  //
  // descr - get's course and web information for new slides 
  global.getCourseNavData = function(){
    chrome.storage.local.get(function(storage){
      global.courseNavData = storage.bb_courses;
    });
  };

  //
  // compareCC
  //
  // descr - compares the CC text from the old slide to the
  // CC text from the new slide and displays a percentage accuracy
  global.compareCC = function(old_text){
    var new_text = document.querySelector('#captionBody');
    if(new_text){
      new_text = new_text.innerText;

      //remove all newline characters from strings
      old_text.replace(/\s+\r?\n\s+|\s+\r\s+/, " ")
        .replace(/\s+\r?\n|\s+\r/, " ")
        .replace(/\r?\n\s+|\r\s+/, " ")
        .replace(/\r?\n|\r/, " ")
        .replace(/\s{3,}/g, " ")
        .trim();
      new_text = new_text.replace(/\s+\r?\n\s+|\s+\r\s+/, " ")
        .replace(/\s+\r?\n|\s+\r/, " ")
        .replace(/\r?\n\s+|\r\s+/, " ")
        .replace(/\r?\n|\r/, " ")
        .replace(/\s{3,}/g, " ")
        .trim();

      //split words into arrays
      new_text = new_text.split(" ");
      old_text = old_text.split(" ");

      var match = [];
      var nLength = new_text.length;
      var oLength = old_text.length;

      for(var i = 0; i < new_text.length; i++){
        for(var j = 0; j < old_text.length; j++){
          if(new_text[i] === old_text[j]){
            match.push(new_text[i]);
            var new_index = new_text.indexOf(new_text[i]);
            var old_index = old_text.indexOf(old_text[j]);
            if(new_index !== -1 && old_index !== -1){
              new_text.splice(new_index, 1);
              i--;
              old_text.splice(old_index, 1);
              j--;
              break;
            }
            else {
              console.error('Could not find word in new or old array!');
            }
          }
        }
      }
      
      console.log('Unmatched new words: ', new_text);
      console.log('Unmatched old words: ', old_text);
      console.log('new words count: ', nLength);
      console.log('old words count: ', oLength);
      console.log('matched words count: ', match.length);
      console.log('percent accuracy: ',
                  nLength > oLength ?
                  ((match.length / nLength) * 100).toFixed(2) :
                  ((match.length / oLength) * 100).toFixed(2));
    }
    else {
      console.log('There is no caption for this page');
    }
  };

})(QA_HELPER_JQUERY, QA_HELPER_GLOBAL);
