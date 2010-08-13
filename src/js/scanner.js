/**
 * scanner.js - responsible for extracting potentially interesting content from the page.
 */
(function(tenk){

/**
 * scans the page for index worthy content
 */
function scanner(window,document,undefined) {
	
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
	
	/**
	 * utility function for getting an element's text content.
	 */
	function gettext(elem) {
		return elem.innerText || elem.textContent;
	}
	
	// concepts borrowed from readability, and adapted to search content scanning
	// http://code.google.com/p/arc90labs-readability/
	var
		
		// list of candidate container elements, and count
		candidates = [],
		count = 0,
		
		// short-hand for custom DOM property
		s = '10score',
		
		// regular expression matching contiguous whitespace characters
		whitespace = /\s+/g,
		
		// iterator vars
		i,
		l,
		j,
		m,
		n;
	
	/**
	 * interrogate an element and assign it a score based on its content.
	 */
	function interrogate(elem) {
		
		var
			parent = elem.parentNode,
			grandparent = parent.parentNode,
			text = gettext(elem).replace(whitespace, ' '),
			len = text.length,
			score = 1,
			points;
		
		if (len > 25) {
			
			if (parent[s] === undefined) {
				parent[s] = 0;
				candidates[count++] = parent;
			}
			
			if (grandparent[s] === undefined) {
				grandparent[s] = 0;
				candidates[count++] = parent;
			}
			
			/* Add points for any commas within this paragraph */
			score += text.split(',').length;
			
			/* For every 100 characters in this paragraph, add another point. Up to 3 points. */
			points = (len * 0.01) << 0;
			score += (points < 4 ? points : 3);
			
			/* Add the score to the parent. The grandparent gets half. */
			parent[s] += score;
			grandparent[s] += score * 0.5;
			
		}
	}
	
	// interrogate all paragraphs
	var ps = document.getElementsByTagName('p');
	for (i=0, l=ps.length; i<l; i++) {
		interrogate(ps[i]);
	}
	
	// interrogate interesting divs
	var
		
		// grab divs in document
		divs = document.getElementsByTagName('div'),
		div,
		
		// regular expression to identify interesting divs
		interesting = /<(a|blockquote|dl|div|img|ol|p|pre|table|ul|br)/i;
		
	for (i=0, l=divs.length; i<l; i++) {
		div = divs[i];
		if ((interesting).test(div.innerHTML)) {
			interrogate(div);
		}
	}
	
	// find the best element among the candidates
	var
		best = null,
		elem,
		links,
		link,
		linklen;
	for (i=0; i<count; i++) {
		elem = candidates[i];
		links = elem.getElementsByTagName('a');
		linklen = 0;
		for (j=0, m=links.length; j<m; j++) {
			link = links[j];
			linklen += gettext(link).length;
		}
		elem[s] = score = elem[s] * (1 - linklen / gettext(elem).length);
		if (!best || score > best[s]) {
			best = elem;
		}
	}
	
	// if none could be found, fall back to the document body
	best = best || document.body;
	
	// get selection - best clue as to the important content on the page
	var selection = document.getSelection() || '';
	
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
				priority.push(el.textContent);
			}
		}
	}
	
	// initialize vars for content scan
	var
		
		// full text content
		content = [],
		
		// queue of elements left to scan, current element, and its children nodes
		queue = [best],
		children,
		
		// current child being evaluated and its nodeType
		child,
		type,
		
		// test for interesting strings
		wordy = /[a-z][a-z][a-z]/i,
		
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
				visible(child)
			) {
				queue[queue.length] = child;
			} else if (type === 3) {
				text = child.nodeValue;
				if ((wordy).test(text)) {
					content[content.length] = text;
				}
			}
		}
	}
	
	// send extracted data off for indexing
	window['10kse'].iframe.contentWindow.postMessage(JSON.stringify({
		url: document.location.href,
		selection: selection,
		title: document.title,
		priority: priority.join(" "),
		content: content.join(" ")
	}), "*");
	
}

// export
tenk.scanner = scanner;

})(window['10kse']);

