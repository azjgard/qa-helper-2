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

    case 'tfs_log':
	scrollLogItems();
	break;
	
    case 'new-slide':
	// Send a message to the API saying that a slide has loaded
	// Add listeners to send the same message each time a new slide is loaded
	requestAPI()
	    .then((response) => {
		console.log('response received');
		console.log(response);
	    });
	break;
    }
    

    function requestAPI() {
	return new Promise((resolve, reject) => {
	    var dataString =  "{\n    \"folderType\": \"Content QA\",\n    \"itemType\": \"Bug\",\n    \"courseTag\": \"AD12-105\",\n    \"webNumber\": \"25\",\n    \"tagsToAdd\": [\n        \"AD12-105\",\n        \"Web25-Example Tag\"\n    ],\n    \"title\": \"AD12-105-06-01-03 - Mismatching images\",\n    \"description\": \"The images don't match; see attachments.\",\n    \"images\": [\n        {\n            \"comment\": \"old slide screenshot\",\n            \"base64\": \"q0245jhskjnf902ihruhsiudfhsdf\"\n        },\n        {\n            \"comment\": \"new slide screenshot\",\n            \"base64\": \"092jnfdgjnp2lsldkmnjkn2iui24u\"\n        }\n    ],\n    \"action\": \"logdetail\"\n}";
	    var settings = {
		"async": true,
		"crossDomain": true,
		"url": "http://u90-fender:43642/api/coursecontent/execute",
		"method": "POST",
		"headers": {
		    "content-type": "application/json",
		    "cache-control": "no-cache",
		    "postman-token": "dd4506c9-62d0-c2a6-af3a-6d28e95b211e"
		},
		"processData": false,
		"data": dataString
	    };

	    $.ajax(settings).done(function (response) {
		resolve(response);
	    });
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
		var mainContainer  = document.querySelector('.grid-canvas.ui-draggable');

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
