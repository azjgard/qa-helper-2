console.log('INITIALIZE.JS loaded');

//
// initializeQaTool
//
// descr - loads the window and new tabs for the qa_helper if it has
// not yet been activated.
function initializeQaTool() {
  return new Promise(function(resolve, reject) {

    chrome.system.display.getInfo(function(displays) {
      generateTabs(displays.length > 1, displays);
    });

    function generateTabs(hasMultipleDisplays, displayData) {
      if (hasMultipleDisplays) {
        var monitor1 = displayData[0];

        chrome.windows.create({
          left: 0,
          url: [
            'https://uti.blackboard.com/webapps/login/?action=relogin', //blackboard
            'http://avondale-iol/index.html' //old site
          ]
        });

        chrome.windows.create({
          left: monitor1.bounds.width + 1,
          url: [
          'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs?level=Stories&showParents=true&_a=backlog', //tfs backlog
          'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs/board/Features?scrollToQA=true' //tfs board
          ]
        })
      }
      else {
        chrome.windows.create({ 
          url: [
            'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs?level=Stories&showParents=true&_a=backlog', //tfs backlog
            'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs/board/Features?scrollToQA=true', //tfs board
            'https://uti.blackboard.com/webapps/login/?action=relogin', //blackboard
            'http://avondale-iol/index.html' //old site
          ],
          state: "maximized"
        });
      }
    }

    qaToolIsActive = true;
    resolve();
  });
}
