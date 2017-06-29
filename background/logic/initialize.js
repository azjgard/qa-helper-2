console.log('INITIALIZE.JS loaded');

//
// initializeQaTool
//
// descr - loads the window and new tabs for the qa_helper if it has
// not yet been activated.
function initializeQaTool() {
  return new Promise(function(resolve, reject) {
    chrome.windows.create({ 
      url: [
        'http://avondale-iol/index.html', //old site,
        'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs?level=Stories&showParents=true&_a=backlog', //tfs backlog
        'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs/board/Features', //tfs board
        'https://uti.blackboard.com/webapps/login/?action=relogin', //blackboard
        'http://avondale-iol/index.html' //old site
      ],
      state: "maximized"
    });
    
    qaToolIsActive = true;
    resolve();
  });
}
