/**
 * intro.js
 */
window['10kse'] = {};
/**
 * scanner.js - responsible for extracting potentially interesting content from the page.
 */
(function(tenk){

/**
 * scans the page for index worthy content
 */
function scanner(window,document) {
	
	// thanks ppk! http://www.quirksmode.org/dom/getstyles.html
	var view = document.defaultView;
	function getStyle(el,styleProp) {
		var style;
		if (el.currentStyle) {
			style = el.currentStyle[styleProp];
		} else if (window.getComputedStyle) {
			style = view.getComputedStyle(el,null).getPropertyValue(styleProp);
		}
		return style;
	}
	
	/**
	 * determine whether a given element is visible
	 */
	function visible(elem) {
		return getStyle(elem, 'display') !== 'none' && getStyle(elem, 'visiblity') !== 'hidden';
	}
	
	// iterator vars
	var
		i,
		j,
		l,
		m,
		n;
	
	// get selection - best clue as to the important content on the page
	var selection = document.getSelection();
	
	// prioritize headings over other content
	var
		tags = 'h1,h2,h3,h4,h5,h6,pre,code'.split(','),
		priority = [],
		elems,
		el;
	for (i=0, l=tags.length; i<l; i++) {
		elems = document.getElementsByTagName(tags[i]);
		for (j=0, m=elems.length; j<m; j++) {
			el = elems[j];
			if (visible(el)) {
				priority.push("<" + tags[i] + ">" + el.textContent);
			}
		}
	}
	
	// initialize vars for content scan
	var
		
		// full text content
		content = [],
		
		// queue of elements left to scan, current element, and its children nodes
		queue = [document.body],
		elem,
		children,
		
		// current child being evaluated and its nodeType
		child,
		type,
		
		// test for interesting strings
		interesting = /[a-z][a-z][a-z]/i,
		
		// tags to ignore
		ignore = /button|link|noscript|script|style/i;
	
	// scan document for content
	while (elem = queue.shift()) {
		children = elem.childNodes;
		for (i=0, l=children.length; i<l; i++) {
			child = children[i];
			type = child.nodeType;
			if (
				type === 1 && 
				!(ignore).test(child.tagName) &&
				getStyle(child, 'display') !== 'none' &&
				getStyle(child, 'visibility') !== 'hidden'
			) {
				queue.push(child);
			} else if (type === 3) {
				text = child.nodeValue;
				if ((interesting).test(text)) {
					content.push(text);
				}
			}
		}
	}
	
	// send extracted data off for indexing
	window['10kse'].iframe.contentWindow.postMessage(JSON.stringify({
		selection: selection,
		priority: priority,
		content: content
	}), "*");
	
}

// export
tenk.scanner = scanner;

})(window['10kse']);

/**
 * indexer.js - responsible for extracting index worthy content from scanned content.
 */
(function(tenk){

/**
 * index interesting page content
 */
function indexer(content) {
	
	
	// index user's selected content (if any)
	
	// index prioritized content
	
	// index full content
	
}

// export
tenk.indexer = indexer;

/* scratch pad

	// initialize vars for content scan
	var
		
		// full text index and counter for document position
		index = {},
		count = 0,
		
		// queue of elements left to scan, current element, and its children nodes
		queue = [document.body],
		elem,
		children,
		
		// current child being evaluated and its nodeType
		child,
		type,
		
		// string content of a TextNode and words in that text
		text,
		words,
		word,
		lc,
		
		// regular expression to test for uninteresting strings
		empty = /^[^a-z]*$/,
		
		// tags to ignore
		ignore = /button|link|noscript|script|style/i,
		
		// so-called "stop" words (uninteresting to search)
		stop = /able|about|across|after|all|almost|also|among|and|any|are|because|been|but|can|cannot|could|dear|did|does|either|else|ever|every|for|from|get|got|had|has|have|her|hers|him|his|how|however|into|its|just|least|let|like|likely|may|might|most|must|neither|nor|not|off|often|only|other|our|own|rather|said|say|says|she|should|since|some|than|that|the|their|them|then|there|these|they|this|tis|too|twas|wants|was|were|what|when|where|which|while|who|whom|why|will|with|would|yet|you|your/i;
	
	// scan document for content
	while (elem = queue.shift()) {
		children = elem.childNodes;
		for (i=0, l=children.length; i<l; i++) {
			child = children[i];
			type = child.nodeType;
			if (
				type === 1 && 
				!(ignore).test(child.tagName) &&
				getStyle(child, 'display') !== 'none' &&
				getStyle(child, 'visibility') !== 'hidden'
			) {
				queue.push(child);
			} else if (type === 3) {
				text = child.nodeValue;
				words = text.split(/[^0-9a-z_]+/i);
				for (j=0, m=words.length; j<m; j++) {
					count++;
					word = words[j];
					if (word.length > 2 && !(empty).test(word) && !(stop).test(word)) {
						lc = word.toLowerCase();
						var entry = index[lc];
						if (!entry) {
							entry = index[lc] = [];
						}
						entry.push(count);
					}
				}
			}
		}
	}
	
	// send extracted data off for indexing
	window['10kse'].iframe.contentWindow.postMessage(JSON.stringify({
		selection: selection,
		headings: headings,
		index: index
	}), "*");

*/

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
	
	// setup namespace
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
		alert(event.data);
	
	}, false);
}

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

