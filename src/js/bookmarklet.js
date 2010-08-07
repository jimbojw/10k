/**
 * bookmarklet.js
 */
(function(document,$){

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
 * implementation of bookmarklet
 */
function bookmarklet(document,origin) {
	
	// open iframe to origin
	
	// use postMessage() to ask for script
	
	
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

// sanitize bookmarklet code
var code = (bookmarklet + '').replace(/\s+/g, ' ');

// attach bookmarklet to "add" link
$('#add')
	.attr('href', ('javascript:(' + code + ')(document,' + origin + ')'))
	.click(function(e){
		e.preventDefault();
		alert(
			"1. Drag this link to your bookmarks,\n" +
			"2. Navigate to another page,\n" +
			"3. Click the bookmarklet to add that page to your search engine."
		);
	});

/* scratch pad
	// initialization
	var
		scan = [d.body],
		elem,
		children,
		pos,
		child,
		type,
		words,
		text,
		word,
		empty = /^[^a-z]*$/,
		ignore = /button|link|noscript|script|style/i;
	
	// get selection - best clue
	
	// prioritize high-level tags (h1, etc)
	
	// everything else
	while (elem = scan.shift()) {
		children = elem.childNodes;
		pos = children.length;
		while (pos--) {
			child = children[pos];
			type = child.nodeType;
			if (type === 1 && !(ignore).test(child.tagName)) {
				scan.push(child);
			} else if (type === 3) {
				text = child.nodeValue;
				words = text.split(/[^0-9a-z_]+/i)
				for (var i=0, l=words.length; i<l; i++) {
					word = words[i];
					if (word.length > 2 && !word.match(empty)) {
					}
				}
			}
		}
	}
	
*/

})(document,jQuery);

