console.log('INITIALIZE.JS loaded');

//
// initializeQaTool
//
// descr - loads the window and new tabs for the qa_helper if it has
// not yet been activated.
function initializeQaTool() {

  function createWindow(obj) {
    return new Promise(function(resolve, reject) {
      chrome.windows.create({ 
        url: [
          'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs?level=Projects&showParents=false&_a=backlog', //tfs backlog
          'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs/board/Features', //tfs board
          'https://uti.blackboard.com/webapps/login/?action=relogin', //blackboard
          'http://avondale-iol/index.html' //old site
        ],
        state: "maximized"
      }, function(win) {
        //store all window info in object that has the windowID as the key
        var template = createQaDataTemplate();
        obj[win.id] = template;
        obj[win.id].window = win;
        resolve(obj);
      });
    });
  }

  function setTabInfo(obj) {
    return new Promise(function(resolve, reject) {
      
      for(var key in obj){
        chrome.tabs.query({ windowId : obj[key].window.id }, function(tabs) {
          var inserted_tabs = insertTabs(tabs);
          obj[key].tabs = inserted_tabs;
        });
      } //end for/in loop
      resolve(obj);
    });
  }

  return new Promise(function(resolve, reject) {
    chrome.windows.create({ 
      url: [
        'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs?level=Projects&showParents=false&_a=backlog', //tfs backlog
        'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs/board/Features', //tfs board
        'https://uti.blackboard.com/webapps/blackboard/content/listContent.jsp?course_id=_3607_1&content_id=_164396_1&mode=reset', //blackboard
        'http://avondale-iol/index.html' //old site
      ],
      state: "maximized"
    });
    
    qaToolIsActive = true;
    resolve();
  });
}
