/**
 * indexer.js - responsible for extracting index worthy content from scanned content.
 */
(function(tenk){

/**
 * index interesting page content
 */
function indexer(data) {
	
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

