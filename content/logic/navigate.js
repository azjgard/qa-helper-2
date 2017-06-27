(function($, global){

  //
  // navigate
  //
  // @return - an object with the following properties:
  //  select_slide - prompt user for 3 number slideID to jump to
  //  next_slide   - load the next slide
  //  prev_slide   - load the previous slide
  global.select_slide = function(){
    // lets you choose the slide to go to
    var slide_reference = prompt("Please enter the 3 number sequence of the slide you want to go to (last three numbers)", "1-01-1"); 
    if (slide_reference) {
      loadSlideByReferenceId(slide_reference); 
    }
  };

  // takes you to the next slide
  global.next_slide = function(){
    loadNextSlide();
  };

  // takes you to the previous slide
  global.prev_slide = function(){
    loadPrevSlide();
  };

})(QA_HELPER_JQUERY, QA_HELPER_GLOBAL);














// //
// //  The Next, Previous, and Select Slide functions don't work if they are scoped
// //  because they need to access the native functions on the slide page.
// //

// //
// // navigate
// //
// // @return - an object with the following properties:
// //  select_slide - prompt user for 3 number slideID to jump to
// //  next_slide   - load the next slide
// //  prev_slide   - load the previous slide
// var select_slide = function(){
//   // lets you choose the slide to go to
//   var slide_reference = prompt("Please enter the 3 number sequence of the slide you want to go to (last three numbers)", "1-01-1"); 
//   if (slide_reference) {
//     loadSlideByReferenceId(slide_reference); 
//   }
// };

// // takes you to the next slide
// var next_slide = function(){
//   console.log("in next");
//   loadNextSlide(); //can't reference this function because it is scoped within our application
// };

// // takes you to the previous slide
// var prev_slide = function(){
//   console.log("in prev");
//   loadPrevSlide(); //can't reference this function because it is scoped within our application
// };