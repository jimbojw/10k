/**
 * intro.js
 */
window['10kse'] = {};
/**
 * scanner.js
 */
(function(tenk){

/**
 * scans the page for index worthy content
 */
function scanner(window,document) {
	
	// initialization
	var
		scan = [document.body],
		elem,
		children,
		child,
		type,
		words,
		text,
		word,
		empty = /^[^a-z]*$/,
		ignore = /button|link|noscript|script|style/i;
	
	var buf = [];
	
	// get selection - best clue
	
	// prioritize high-level tags (h1, etc)
	
	// everything else
	var stop = /able|about|across|after|all|almost|also|among|and|any|are|because|been|but|can|cannot|could|dear|did|does|either|else|ever|every|for|from|get|got|had|has|have|her|hers|him|his|how|however|into|its|just|least|let|like|likely|may|might|most|must|neither|nor|not|off|often|only|other|our|own|rather|said|say|says|she|should|since|some|than|that|the|their|them|then|there|these|they|this|tis|too|twas|wants|was|were|what|when|where|which|while|who|whom|why|will|with|would|yet|you|your/i;
	while (elem = scan.shift()) {
		children = elem.childNodes;
		for (var i=0, l=children.length; i<l; i++) {
			child = children[i];
			type = child.nodeType;
			if (type === 1 && !(ignore).test(child.tagName)) {
				scan.push(child);
			} else if (type === 3) {
				text = child.nodeValue;
				words = text.split(/[^0-9a-z_]+/i);
				for (var j=0, m=words.length; j<m; j++) {
					word = words[j];
					if (word.length > 2 && !(empty).test(word) && !(stop).test(word)) {
						buf.push(word);
					}
				}
			}
		}
	}
	
	alert(buf.join(", "));
	
}

// export
tenk.scanner = scanner;

})(window['10kse']);

/**
 * bookmarklet.js
 */
(function(window,document,$,tenk){

// thanks ppk! http://www.quirksmode.org/js/cookies.html
function createCookie(name,value) {
	var date = new Date();
	date.setTime(date.getTime()+(10*365*24*60*60*1000));
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
	
	// listen for script posted from origin and eval it
	window.addEventListener("message", function (event) {
		if (origin.substr(0, event.origin.length)===event.origin) {
			(new Function(event.data))();
		}
	}, false);
	
	// open iframe to origin and style it
	var
		iframe = document.createElement('iframe'),
		style = iframe.style;
	iframe.setAttribute('src', origin);
	style.width = style.height = "500px";
	style.top = style.left = "100px";
	style.position = "absolute";
	
	// prepare listeners for iframe state changes, and
	// when iframe is ready, use postMessage() to ask for script
	var
		done = false,
		body = document.body;
	iframe.onload = iframe.onreadystatechange = function() {
		if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
			done = true;
			iframe.onload = iframe.onreadystatechange = null;
			iframe.contentWindow.postMessage("script", origin);
		}
	};
	
	// append iframe
	body.insertBefore(iframe,body.firstChild);
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
 * listen for incoming messages
 */
window.addEventListener("message", function(event) {
	
	// serve script to anyone who requests it
	if (event.data === "script") {
		event.source.postMessage('(' + tenk.scanner + ')(window,document)', "*");
		return;
	}
	
	// process index submission
	
}, false);

})(window,document,jQuery,window['10kse']);

/**
 * search.js
 */
(function(window, document, $, undefined){

// implementation of search
$('form').submit(function(e){
	
	e.preventDefault();
	
	// TODO: Implement me
	
});


})(window, document, jQuery);

