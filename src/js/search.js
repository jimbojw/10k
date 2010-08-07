/**
 * script.js
 */
(function(window, document, $, undefined){

/**
 * implementation of bookmarklet
 */
function bookmarklet(w,d) {
	
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
		buf = [],
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
						buf.push(word);
					}
				}
			}
		}
	}
	
	alert(buf.join(", "));
}
$('#add')
	.attr('href', ('javascript:(' + bookmarklet + ')(window,document)').replace(/\n/g, ' '))
	.click(function(e){
		e.preventDefault();
		alert(
			"1. Drag this link to your bookmarks,\n" +
			"2. Navigate to another page,\n" +
			"3. Click the bookmarklet to add that page to your search engine."
		);
	});

// implementation of search
$('form').submit(function(e){
	e.preventDefault();
	
});


})(window, document, jQuery);

