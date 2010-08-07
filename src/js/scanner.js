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
				words = text.split(/[^0-9a-z_]+/i)
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

