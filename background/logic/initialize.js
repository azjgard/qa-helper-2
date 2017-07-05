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
        var monitor2 = displayData[0];

        chrome.windows.create({
          height: monitor1.bounds.height,
          width: monitor1.bounds.width,
          left: 0,
          top: 0,
          url: [
            'https://uti.blackboard.com/webapps/login/?action=relogin' //blackboard
          ]
        });

        chrome.windows.create({
          height: monitor2.bounds.height,
          width: monitor2.bounds.width,
          left: monitor1.bounds.width,
          top: 0,
          url: [
          'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs?level=Stories&showParents=true&_a=backlog', //tfs backlog
          'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs/board/Features?scrollToQA=true', //tfs board
          'http://avondale-iol/' // DR site
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
