console.log('INITIALIZE.JS loaded');

//
// initializeQaTool
//
// descr - loads the window and new tabs for the qa_helper if it has
// not yet been activated. it also sets up the attributes of the global
// 'qaData' object to be able to reference in other parts of the code
function initializeQaTool() {

  function createWindow(obj) {
    return new Promise(function(resolve, reject) {
      chrome.windows.create({ 
        url: [
          'http://avondale-iol/AD-105.html',
          'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs?level=Projects&showParents=false&_a=backlog',
          'https://uti.blackboard.com/webapps/login/?action=relogin'
        ]
      }, function(win) {
        obj.window = win;
        resolve(obj);
      });
    });
  }

  function setTabInfo(obj) {
    return new Promise(function(resolve, reject) {
      chrome.tabs.query({ windowId : obj.window.id }, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
          var curURL = tabs[i].url;

          if (curURL.includes('avondale-iol'))            { obj.tabs.dr  = tabs[i]; }
          else if (curURL.includes('prdtfs.uticorp.com')) { obj.tabs.tfs = tabs[i]; }
          else if (curURL.includes('uti.blackboard.com')) { obj.tabs.bb  = tabs[i]; }

          resolve(obj);
        }
      });
    });
  }

  return new Promise(function(resolve, reject) {
    var obj = {
      window: null,
      tabs: {
        dr: null,
        bb: null,
        tfs: null
      }
    };

    createWindow(obj)
      .then(setTabInfo)
      .then(function(obj) {
        qaToolIsActive = true;
        resolve(obj);
      });
  });
}
