(function($, global) {

//TEST
  global.addToPage = function() {
//TEST

console.log('ADD TO THE PAGE CALLED...');


  // addItem
  //
  // descr - walk the TFS DOM and adds the item according to the params specified
  //
  // @param folderType - name of the folder we're adding to (e.g. "Content QA", "Functional QA")
  // @param itemType   - name of the item we're adding (e.g. "Bug", "Task", "Issue")
  // @param courseTag  - the tag of the course we're adding to (e.g. "AD12-105")
  // @param webNumber  - the number of the web we're adding to (e.g. "25")
  // @param tagsToAdd  - a string or array of strings that should be added as tags to the new item

  // global.addItem = function(folderType, itemType, courseTag, webNumber, tagsToAdd) {


//TEST
  window.addBugToThePage = function(folderType, itemType, courseTag, webNumber, tagsToAdd) {
//TEST


    var mainContainer = document.querySelector('.grid-canvas.ui-draggable');
    var maxScrollTop  = 60700;

    var recursionDelay = 10;

    // scroll
    //
    // descr - recursive function that will scroll the DOM in TFS
    // in search of the folder that matches what it is looking for
    var scroll = (courseTag, webNumber, scrollTop) => {
      var folderFound = false; // flag to show if we found what we were looking for
      var folder = findFolder(courseTag, webNumber); // search the DOM for matching folder

      // if the correct folder is found, set the flag to true
      if (folder !== false) {
        folderFound = true;
      }

      if (scrollTop >= maxScrollTop || folderFound) {
        if (folderFound) {
          // if the folder is out of view when it is found, then bring it into view
          if (folder.getBoundingClientRect().top > 900) { mainContainer.scrollTop += 300; }
          // add the correct item
          addItem(itemType, folder)
        }
        else {
          alert(
            'Nothing was found that matched those parameters!\n\n' + 
            'Course Tag:\n' + courseTag + '\n\n' +
            'Web Number:\n' + webNumber
          );
        }
        return folderFound;
      }

      // scroll the container
      mainContainer.scrollTop = scrollTop;

      // recurse with a timeout
      setTimeout(() => scroll(courseTag, webNumber, scrollTop + 200), recursionDelay);   
    };

    //
    // findFolder
    //
    // descr - walks the DOM in TFS to find the folder that matches
    // the specified type, courseTag, and webNumber
    //
    // NOTE: the variables have the word QA in them because originally this function
    // was called 'findQAFolder' and we just haven't changed them since
    var findFolder = (courseTag, webNumber) => {
      var contentQAFolders = $('.grid-cell:contains("' + folderType + '")');
      var correctContentQAFolder = false;

      if (contentQAFolders.length > 0) {
        $.each(contentQAFolders, (index, folder) => {
          var tags = $(folder).siblings().find('.tag-item');

          var courseMatch = false;
          var webMatch = false;

          if (tags.length > 0) {
            $.each(tags, (index, tag) => {
             var tagName = $(tag).attr('title');

             var isWebTag = /^web/i;
             var isCourseTag = /^[A-Z]{2}\d{2,}-/;

             // web tags
             if (isWebTag.test(tagName)) {
               var localWebNumber = tagName.match(/^web\d{2,}/i)[0].match(/\d{2,}/)[0];
               if (parseInt(localWebNumber) === parseInt(webNumber)) {
                 webMatch = true;
               }
             }

             // course tags
             else if (isCourseTag.test(tagName)) {
               if (courseTag === tagName) {
                 courseMatch = true;
               }
             }

             // found a match
             if (courseMatch && webMatch) {
               correctContentQAFolder = folder;
               return false;
             }
           });
          }

          // break outer loop if we found it
          if (correctContentQAFolder !== false) {
            return false;
          }
        });
      }

      // will return the folder OR false if not found
      return correctContentQAFolder;
    };

    // 
    // addItem
    //
    var addItem = (itemType, folder) => {
      // click the + button
      $(folder).siblings().find('.icon.action').click();

      // click the item type button (Bug, Task, Issue, etc.)
      $('.sub-menu').find('li[title="'+ itemType + '"]').click(); 

      // add the tags
      setTimeout( () => {
        // if arg is array
        if (tagsToAdd.length && typeof tagsToAdd !== "string") {
          console.log('tags to add:');
          console.log(tagsToAdd);
          for (var i = 0; i < tagsToAdd.length; i++) {
            addTag(tagsToAdd[i]);
          }
        }
        // if arg is just a strings
        else {
          addTag(tagsToAdd);
        }
      }, 700);
    };

  //
  // addTag
  //
  // @param tag - a string representation of the tag to be added
  function addTag(tag) {
      console.log(tag);
    setTimeout(function(){
        console.log('timeout ran')
      var $input        = '';
      var $addButton    = $('.tag-box.tag-box-selectable');
      var pressEnterKey = $.Event('keydown', { keyCode : 13 });

      $addButton.click();
      $input = $('.tags-input.tag-box.ui-autocomplete-input');

      $input.val(tag);
      $input.trigger(pressEnterKey); //this isn't working most of the time
    }, 1500);
  }
    // //
    // // addTag
    // //
    // var addTag = (tagName) => {
    //   console.log('Attempting to add the tag: ' + tagName);

    //   var pressEnterKey = $.Event('keydown', { keyCode : 13 });

    //   // click the 'Add' button
    //   $('.tag-box.tag-box-selectable').click();

    //   console.log('Add button clicked!');

    //   // focus & put the tag in the input box
    //   $('.tags-input.tag-box.ui-autocomplete-input')
    //   .focus()
    //   .val(tagName)
    //   .trigger(pressEnterKey); // hit enter to add the tag
    // };

    // execute
    scroll(courseTag, webNumber, 0);
  }

//TEST
}
//TEST

})(QA_HELPER_JQUERY, QA_HELPER_GLOBAL);
