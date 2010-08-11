/**
 * bookmarklet.js - linchpin holding scanner and indexer behavior together.
 */
(function(window,document,$,tenk){

// thanks ppk! http://www.quirksmode.org/js/cookies.html
function createCookie(name,value) {
	var date = new Date();
	date.setTime(date.getTime() + 3E11);
	document.cookie = name + "=" + value + "; expires=" + date.toGMTString() + "; path=/";
}
function readCookie(name) {
	var
		nameEQ = name + "=",
		ca = document.cookie.split(';'),
		c;
	for(var i=0, l=ca.length;i < l;i++) {
		c = ca[i];
		while (c.charAt(0)===' ') {
			c = c.substr(1);
		}
		if (c.indexOf(nameEQ) === 0) {
			return c.substr(nameEQ.length);
		}
	}
	return null;
}

/**
 * implementation of chain-loading bookmarklet
 */
function bookmarklet(window,document,origin) {
	
	// setup the 10kse namespace
	// NOTE: This does not duplicate the code in intro.js since 
	//       the bookmarklet will be running in a different page.
	var tenk = window['10kse'];
	if (!tenk) {
		tenk = window['10kse'] = {};
	}
	
	// if script was previously retrieved, simple rexecute it
	if (tenk.scanner) {
		return tenk.scanner();
	}
	
	// listen for script posted from origin and eval it
	window.addEventListener("message", function (event) {
		if (origin.substr(0, event.origin.length)===event.origin) {
			tenk.scanner = new Function(event.data);
			tenk.scanner();
		}
	}, false);
	
	// open iframe to origin and style it
	var
		iframe = tenk.iframe = document.createElement('iframe'),
		style = iframe.style;
	iframe.setAttribute('src', origin);
	style.width = style.height = "1px";
	style.top = style.left = "-2px";
	style.border = "none";
	style.position = "absolute";
	
	// prepare listeners for iframe state changes, and
	// when iframe is ready, use postMessage() to ask for script
	var done = false;
	iframe.onload = iframe.onreadystatechange = function() {
		if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
			done = true;
			iframe.onload = iframe.onreadystatechange = null;
			iframe.contentWindow.postMessage("script", origin);
		}
	};
	
	// append iframe
	document.body.appendChild(iframe);
}

// generate random cookie to prevent postMessage() spam, and
// create composit origin url for anchor tag
var
	origin = document.location.href,
	key = readCookie('key');
if (!key) {
	key = Math.random();
	createCookie('key',key);
}
origin = JSON.stringify(origin.replace(/#.*|$/, '#' + key));

// attach bookmarklet to "add" link
$('#add')
	.attr('href', ('javascript:(' + bookmarklet + ')(window,document,' + origin + ')').replace(/\s+/g, ' '))
	.click(function(e){
		e.preventDefault();
		alert(
			"1. Drag this link to your bookmarks,\n" +
			"2. Navigate to another page,\n" +
			"3. Click the bookmarklet to add that page to your search engine."
		);
	});

/**
 * listen for incoming messages when in iframe mode
 */
if (window !== window.top && document.location.hash === '#' + key) {
	window.addEventListener("message", function(event) {
		
		// serve script to anyone who requests it
		if (event.data === "script") {
			event.source.postMessage('(' + tenk.scanner + ')(window,document)', "*");
			return;
		}
		
		// process index submission
		tenk.indexer(JSON.parse(event.data));
		
	}, false);
}

})(window,document,jQuery,window['10kse']);

