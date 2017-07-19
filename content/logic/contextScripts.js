(function($, global) {
    var context = getContext();
    var queryString = window.location.search ?
	    window.location.search.replace('?','') :
	    '';

    // console.log('Your context is: ' + context);

    switch (context) {
    case 'tfs_board':
	scrollTFS(queryString);
	break;

    case 'tfs_log-load_page':
	scrollLogItems();
	break;
	
    case 'new-slide':
	logToAPI()
	    .then((response) => {
		// console.log('response received');
		// console.log(response);
	    });
	
	setTimeout(() => {
	    $('#btn-next').on('click', logToAPI);
	}, 1500);

	break;
    }
    
    function waitTillSelector(selector, maxTimeout) {
	let el = $(selector);

	if (el.length >= 1) {
	    resolve(el);
	}
    }

    function logToAPI() {
	return new Promise((resolve, reject) => {
	    let apiURL = "https://u90-fender.uticorp.com/api/coursecontent/execute";
	    let headers = {
		"content-type": "application/json",
		"cache-control": "no-cache"
	    };

	    let data = {
		folderType: "Content QA",
		itemType: "Bug",
		courseTag: "AD12-105",
		webNumber: "25",
		tagsToAdd: ["AD12-105", "Web25-Example Tag"],
		title: "AD12-105-06-01-03 - Mismatching images",
		description: "The images don't match; see attachments.",
		images: [
		    {
			comment: "old slide screenshot",
			base64: "q0245jhskjnf902ihruhsiudfhsdf"
		    },
		    {
			comment: "new slide screenshot",
			base64: "092jnfdgjnp2lsldkmnjkn2iui24u"
		    }
		],
		action: "logdetail"
	    };

	    let settings = {
		"async": true,
		"crossDomain": true,
		"url": apiURL,
		"method": "POST",
		"headers": headers,
		"processData": false,
		"data": JSON.stringify(data)
	    };

	    $.ajax(settings).done(function (response) {
		resolve(response);
	    });
	}, (err) => {
	    console.log('There was an error');
	    console.log(err);
	});
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
	    $('body').append('<div class="disabled-screen-cover"/>');

	    setTimeout( () => {
		var mainContainer = document.querySelector('.grid-canvas.ui-draggable');

		$('body').append('<div class="qa-ext_popup external">'		+
				 '<h3>Loading TFS information..'		+
				 '<br>'					+
				 '<small style="color:gray">'		+
				 '(If not loading, refresh page)'	+
				 '</small>'					+
				 '</h3>'					+
				 '<div class="qa-ext_progressBar" />'	+
				 '</div>');

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
