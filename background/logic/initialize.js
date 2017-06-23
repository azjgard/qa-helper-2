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



    //this logs all the urls of all open windows' tabs to the console
      // chrome.windows.getAll({populate:true}, function(win){
      //   for (var i = 0; i < win.length; i++) {
      //     for (var j = 0; j < win[i].tabs.length; j++) {
      //       console.log(win[i].tabs[j].url);
      //     }
      //   }
      //   console.log(win);
      // });




      chrome.windows.create({ 
        url: [
          'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs?level=Stories&showParents=true&_a=backlog', //tfs backlog
          'https://prdtfs.uticorp.com/UTI-ALM/IT/BMS/_backlogs/board/Features', //tfs board
          'https://uti.blackboard.com/webapps/login/?action=relogin', //blackboard
          'http://avondale-iol/index.html' //old site
        ],
        state: "maximized"
      }, function(win) {
        //store all window info in object that has the windowID as the key
        obj[win.id] = {
          window: win,
          tabs: {
            dr: null,
            bb: null,
            tfs_log: null,
            tfs_board: null
          }
        };
        resolve(obj);
      });
    });
  }

  function setTabInfo(obj) {
    return new Promise(function(resolve, reject) {
      
      for(var key in obj){

        chrome.tabs.query({ windowId : obj[key].window.id }, function(tabs) {
          
          for (var i = 0; i < tabs.length; i++) {
            var curURL = tabs[i].url;

            if (curURL.includes('avondale-iol'))            { obj[key].tabs.dr  = tabs[i]; }
            else if (curURL.includes('prdtfs.uticorp.com')) { 
              
              if(curURL.includes('board')){
                obj[key].tabs.tfs_board = tabs[i];
              } else {
                obj[key].tabs.tfs_log = tabs[i];
              } 

            }
            else if (curURL.includes('uti.blackboard.com')) { obj[key].tabs.bb  = tabs[i]; }

            resolve(obj);
          }
        });
      } //end for/in loop
    });
  }

  return new Promise(function(resolve, reject) {
    var obj = {};

    createWindow(obj)
      .then(setTabInfo)
      .then(function(obj) {
        qaToolIsActive = true;
        resolve(obj);
      });
  });
}
