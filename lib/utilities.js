// Only functions that are used by both the background 
// and content scripts should go in this file

//
// getContext
//
// descr - returns a string describing the context of the page
// that the script is currently running inside of
var getContext = function(which_tab) {
  var loc;
  if(which_tab){
    loc = which_tab;
  }
  else {
    var loc = window.location.href;
  }

  var pattern_tfs      = /prdtfs\.uticorp\.com/i;
  var pattern_newSlide = /courses\/\w{1,}\/uti_bms_qa_uat\/content/i;
  var pattern_oldSlide = /lmsinit\.htm/i;
  var pattern_login = /webapps\/login/;

  function isPage(pattern) {
    return loc.match(pattern);
  }

  // DR site
  if (loc.includes('avondale-iol')) {
    if (isPage(pattern_oldSlide)) {
      return 'old-slide'; 
    }
    else {
      return 'dr';
    }
  }

  // TFS
  else if (isPage(pattern_tfs)) {
    if(loc.includes('board')){
      return 'tfs_board';
    }
    else if (loc.includes('UTI-ALM/IT/BMS/_backlogs?level=Stories&showParents=true&_a=backlog')) {
      return 'tfs_log-load_page';
    }
    else {
      return 'tfs_log';
    }
  }

  // Blackboard site
  else if (loc.includes('uti.blackboard.com')) {
    if (isPage(pattern_newSlide)) {
      return 'new-slide';
    }
    else if (isPage(pattern_login)) {
      return 'bb-login';
    }
    else {
      return 'bb';
    }
  }

  // Site irrelevant to the plugin
  else {
    return 'misc';
  }
}
