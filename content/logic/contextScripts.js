(function($, global) {
  var context = getContext();
  var queryString = window.location.search ?
                    window.location.search.replace('?','') :
                    '';

  console.log('Your context is: ' + context);

  switch (context) {
    case 'bb-login':
      // promptForAutoLogin();
      // chrome.storage.sync.clear();
      break;
    case 'tfs_board':
      scrollTFS(queryString);
      break;

    case 'tfs_log':
      scrollLogItems();
      break;
    // case 'dr':
    //   scrapeData(queryStringToJSON(queryString));
    //   break;
  }

  function scrollTFS(queryString) {
    var qJSON = queryStringToJSON(queryString);
    
    if (qJSON.scrollToQA) {
      $(document).ready(() => {
        setTimeout(() => $('.agile-content-container.scrollable').scrollLeft(3100), 1000);
      });
    }
  }

  function scrollLogItems() {
    $(document).ready( () => {
      $('body').append('<div class="disabled-screen-cover"/>') 

      setTimeout( () => {
        var mainContainer  = document.querySelector('.grid-canvas.ui-draggable');

        $('body').append('<div class="qa-ext_popup external"><h3>Loading TFS information..</h3><div class="qa-ext_progressBar" /></div>');

        $('.qa-ext_progressBar').progressbar({ value: 0 });

        function recurse() {
          if (mainContainer.scrollTop > 60000) {
            $('.qa-ext_progressBar').progressbar({ value: 100 });
            $('.qa-ext_popup.external').fadeOut();
            $('.disabled-screen-cover').fadeOut();
            mainContainer.scrollTop = 0;
            return;
          }

          $('.qa-ext_progressBar').progressbar({ value: (mainContainer.scrollTop / 60000) * 100 });

          mainContainer.scrollTop += 1100;
          setTimeout( () => recurse(), 200);
        }

        recurse();
      }, 1500);
    });
  }
})(QA_HELPER_JQUERY, QA_HELPER_GLOBAL);


// 1. Click all the links on the first page, setting the layer to 1
// 2. Click all the links on the second page, setting the layer to 2
// 3. Return all of the links on the third page because the layer was detected to be at 2.
// function scrapeData(qData) {

//   // old page
//   if (qData.layer1) {
//     var links = document.getElementsByTagName('a');

//     // dont do the last one because it isnt a regular link
//     for (var i = 0; i < 1; i++) {
//       openWindow(links[i], 'layer2=true&closeMe=true')
//     }
//   }

//   // courses
//   if (qData.layer2) {
//     var links = document.getElementsByTagName('a');
//     var unresolved = [];

//     for (var i = 1; i < 2; i++) {
//       unresolved.push(openWindow(links[i], 'layer3=true&closeMe=true'));
//     }

//     // Promise.all(unresolved).then(closeWindow);
//   }

//   // modules
//   if (qData.layer3) {
//     var links = document.getElementsByTagName('a');
//     var unresolved = [];

//     for (var i = 1; i < 2; i++) {
//       unresolved.push(openWindow(links[i], 'layer4=true&closeMe=true'));
//     }
    
//     // Promise.all(unresolved).then(closeWindow);
//   }

//   // webs
//   // NO here im going to grab the links and start storing them in the background
//   if (qData.layer4) {
//     var links = document.getElementsByTagName('a');
//     var data = [];

//     for (var i = 0; i < links.length; i++) {
//       data.push(links[i].href);
//     }
//     storeData(data, function() {
//       closeWindow();
//     });
//   }
// }

function openWindow(url, qString) {
  return new Promise( (resolve, reject) => {
    chrome.runtime.sendMessage({
      message: 'openToWindow',
      url: url + '?' + qString
    }, resolve);
  });
}

function closeWindow() {
  chrome.runtime.sendMessage({ 'message' : 'closeMe' });
}

function storeData(data, cb) {
  chrome.runtime.sendMessage({
    'message': 'storeThis',
    'data' : data
  }, cb);
}

// TODO FIXME: come back another day to figure out the stupid nested data situation

// dontAskForLogin - true or false - if false, this function should never run
// bbUsername - string - if set, this will be grabbed and the username field will be populated
// bbPass - string - if set, this will be grabbed and the password field will be populated
function promptForAutoLogin() {

  var setStorageItem = (obj) => new Promise( (resolve, reject) => chrome.storage.sync.set(obj, resolve) );
  var getStorageItem = (key) => new Promise( (resolve, reject) => chrome.storage.sync.get(key, resolve) );
  var nullStorage = (obj) => Object.keys(obj).length === 0 && obj.constructor === Object;

  let promptForCredential = (cred) => prompt('There is no QA ' + cred + ' for you on file. Please enter it below:');

  let checkCredentials = (username, password) => {
    if (!username) { username = promptForCredential('username'); }
    if (!password) { password = promptForCredential('password'); }

    if (username && password) {
      console.log(username);
      console.log(password);
      console.log('================');

      setStorageItem({ 'bbUsername' : username })
      .then( () => getStorageItem('bbUsername').then( (val) => console.log(val) ));

      setStorageItem({ 'bbPassword' : password })
      .then( () => getStorageItem('bbPassword').then( (val) => console.log(val) ));

      // .then( () => login(username, password ));
    }
  }

  let login = (user, pass) => {
    document.getElementById('user_id').value = user;
    document.getElementById('password').value = pass;
    // document.getElementById('entry-login').click();
  }

  var dontAskForLogin = getStorageItem('dontAskForLogin');
  var username = getStorageItem('bbUsername');
  var password = getStorageItem('bbPassword');

  Promise.all([dontAskForLogin, username, password])
  .then((values) => {
    var a1 = values[0];
    var a2 = values[1];
    var a3 = values[2];

    if (nullStorage(a1)) { a1 = false; }
    if (nullStorage(a2)) { a2 = false; }
    if (nullStorage(a3)) { a3 = false; }

    console.log(a1);
    console.log(a2);
    console.log(a3);
    console.log('-----');

    if (a1 !== true) {
      checkCredentials(a2, a3);
    }
  });
}

function queryStringToJSON(qs) {
    qs = qs || location.search.slice(1);

    var pairs = qs.split('&');
    var result = {};
    pairs.forEach(function(pair) {
        var pair = pair.split('=');
        var key = pair[0];
        var value = decodeURIComponent(pair[1] || '');

        if( result[key] ) {
            if( Object.prototype.toString.call( result[key] ) === '[object Array]' ) {
                result[key].push( value );
            } else {
                result[key] = [ result[key], value ];
            }
        } else {
            result[key] = value;
        }
    });

    return JSON.parse(JSON.stringify(result));
};
