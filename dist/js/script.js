/**
 * intro.js
 */
(function(window){


var
	
	// storage api
	storage = window.localStorage,
	
	// serialization api
	stringify = window.JSON.stringify,
	parse = window.JSON.parse,
	
	// establish 10k search engine namespace
	tenk = window['10kse'] = {},
	
	// so-called "stop" words (uninteresting to a search application)
	stopwords = "able|about|across|after|all|almost|also|among|and|any|are|because|been|but|can|cannot|could|dear|did|does|either|else|ever|every|for|from|get|got|had|has|have|her|hers|him|his|how|however|into|its|just|least|let|like|likely|may|might|most|must|neither|nor|not|off|often|only|other|our|own|rather|said|say|says|she|should|since|some|than|that|the|their|them|then|there|these|they|this|tis|too|twas|wants|was|were|what|when|where|which|while|who|whom|why|will|with|would|yet|you|your".split("|"),
	stop = {};

// build stop hash
for (var i=0, l=stopwords.length; i<l; i++) {
	stop[stopwords[i]] = true;
}

/**
 * get an item from localStorage.
 */
function get(key) {
	var value = storage.getItem(key);
	return value ? parse(value) : value;
}

/**
 * put an item into localStorage
 */
function set(key, value) {
	return storage.setItem(key, stringify(value));
}

// exports
tenk.get = get;
tenk.set = set;
tenk.stop = stop;

})(window);
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

/**
 * indexer.js - responsible for extracting index worthy content from scanned content.
 */
(function(tenk,window){

var
	
	// local refs to local storage api
	get = tenk.get,
	set = tenk.set,
	
	// anything that doesn't belong to a 'word'
	nonword = /[^0-9a-z_]+/i,
	
	// so-called "stop" words (uninteresting to search)
	stop = tenk.stop;

/**
 * extract meaningful words and their positions from input text (create an inverted index).
 * @param {string} text Input text from which to extract words.
 * @return {object} Hash connecting words to there position lists
 */
function extract(text) {
	
	var
		
		// iteration variables
		i,
		l,
		
		// words in a text input
		words,
		word,
		
		// position within all text
		pos = 0,
		
		// lower cased word
		lc,
		
		// output hash mapping words to positions
		index = {},
		
		// array of positions for a word in the hash
		entry;
	
	words = text.split(nonword);
	
	for (i=0, l=words.length; i<l; i++) {
		
		pos++;
		word = words[i];
		lc = word.toLowerCase();
		
		if (word.length > 2 && !stop[lc]) {
			
			
			entry = index[lc];
			if (!entry) {
				entry = index[lc] = [];
			}
			
			entry[entry.length] = pos;
			
		}
	}
	
	return index;
}

/**
 * update store's records for a given document
 * @param {int} id ID of the document being updated.
 * @param {string} type Type of text being considered (selection, priority, or full content).
 * @param {string} text Text to be indexed.
 */
function update(id, type, text) {
	
	// short-circuit of nothing of value has been sent
	if (!text || !(/[a-z]/i).test(text)) {
		return;
	}
	
	var
		
		// extract a word/tuple index from the text
		index = extract(text),
		
		// current word
		word,
		
		// record for word in store
		record,
		
		// entry for current document within record
		entry;
	
	for (word in index) {
		
		// get entry for word from store
		record = get("W-" + word) || {};
		
		// ensure that this document is represented
		entry = record[id];
		if (!entry) {
			entry = record[id] = {};
		}
		
		// set (overwrite) positions for this type
		entry[type] = index[word];
		
		// set record for word in store
		set("W-" + word, record);
		
	}
	
}

/**
 * index interesting page content
 */
function indexer(data) {
	
	var
		
		// id and full text content of document
		id,
		text,
		
		// determine whether this url has been seen before
		doc = get("URL-" + data.url);
	
	// doc already exists
	if (doc) {
		
		id = doc.id;
		
		// if content is new, insert into store
		if (data.content !== doc.text || data.title !== doc.title) {
			set("URL-" + data.url, {
				id: id,
				text: data.content,
				title: data.title
			});
		}
		
	// doc never seen before
	} else {
		
		// look up current document count
		id = get("COUNT") || 0;
		
		// assign ID to doc
		set("ID-" + id, data.url);
		
		// set current document count
		set("COUNT", id + 1);
		
		// insert into store
		set("URL-" + data.url, {
			id: id,
			text: data.content,
			title: data.title
		});
		
	}
	
	// update indexes
	update(id, "s", data.selection);
	update(id, "t", data.title);
	update(id, "p", data.priority);
	update(id, "c", data.content);
	
}

// export
tenk.extract = extract;
tenk.indexer = indexer;

})(window['10kse'],window);

/**
 * bookmarklet.js - linchpin holding scanner and indexer behavior together.
 */
(function(window,document,$,tenk){

var
	
	// storage api
	get = tenk.get,
	set = tenk.set,
	
	// serialization api
	stringify = JSON.stringify;

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

// generate random token to prevent postMessage() spam, and
// create composit origin url for anchor tag
var
	origin = document.location.href,
	key = get('key');
if (!key) {
	key = Math.random();
	set('key',key);
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

/**
 * showall.js - show all pages entered so far.
 */
(function(tenk,$,window){

// short-circuit if this page is in an iframe
if (window !== window.top) {
	return;
}

var
	
	// storage api
	get = tenk.get,
	
	// document characteristics
	id = get("COUNT") || 0,
	url,
	doc;

// show pages added so far, in reverse chronological order
if (id > 0) {
	
	var $list = $('<ul></ul>')
		.appendTo(
			$('.entries')
				.find('div')
					.empty()
		);
	
	while (id > 0) {
		id--;
		url = get("ID-" + id);
		doc = get("URL-" + url);
		$('<li><a></a></li>')
			.find('a')
				.attr('href', url)
				.attr('title', doc.title)
				.text(doc.title)
			.end()
			.appendTo($list);
	}
}

})(window['10kse'],jQuery,window);

/**
 * search.js
 */
(function(window,document,tenk,$,undefined){

var
	
	// storage api
	get = tenk.get,
	
	// stop words
	stop = tenk.stop,
	
	// serialization api
	stringify = JSON.stringify,
	
	// cached jqueri results
	$results = $('.results dl'),
	$input = $('.search input');

/**
 * normalize a set of scores.
 * @param {object} scores Hash containing id/score pairs.
 * @param {int} multiplier Number to multiply each score by prior to normalization (accounts for direction).
 * @return {object} scores Hash containing id/normalized score pairs (highest is best, 0-1 range).
 */
function normalize(scores, multiplier) {
	
	if (multiplier === undefined) {
		multiplier = 1;
	}
	
	var
		normalized = {},
		id,
		high,
		low,
		spread,
		s;
	
	for (id in scores) {
		s = normalized[id] = scores[id] * multiplier;
		if (high === undefined || s > high) {
			high = s;
		}
		if (low === undefined || s < low) {
			low = s;
		}
	}
	
	spread = 1 / (high - low);
	
	for (id in normalized) {
		normalized[id] = (normalized[id] - low) * spread;
	}
	
	return normalized;
}

/**
 * count how many times the terms appear in the document
 * @param {object} ids Hash in which keys are document ids (values unimportant).
 * @param {array} terms List of search terms provided.
 * @param {string} type The type of content to count ('s'election, 't'itle, 'p'riority, or 'c'ontent).
 * @param {object} recordcache Hash mapping words to their localStorage values.
 * @return {object} Hash of id/score pairs.
 */
function wordcount(ids, terms, type, recordcache) {
	
	if (!recordcache) {
		recordcache = {};
	}
	
	var
		scores = {},
		term,
		record,
		id,
		entry,
		positions;
	
	for (var i=0, l=terms.length; i<l; i++) {
		
		term = terms[i];
		if (term.length > 2 && !stop[term]) {
			
			record = recordcache[term] || (recordcache[term] = get("W-" + term));
			
			for (id in ids) {
				
				entry = record[id];
				if (entry) {
					
					positions = entry[type];
					if (positions) {
						if (scores[id] === undefined) {
							scores[id] = 0;
						}
						scores[id] += (+positions.length);
					}
					
				}
				
			}
			
		}
		
	}
	
	return scores;
	
}

/**
 * search form behavior
 */
function search(e) { 
	
	e.preventDefault();
	
	var
		
		// extract terms from supplied search input string
		terms = ($input.val() || '').toLowerCase().split(/[^a-z0-9_]/),
		
		// iteration vars
		i,
		l,
		term,
		record,
		
		// matching document ids
		ids = {},
		id,
		
		// record cache
		recordcache = {};
	
	// collect matching document ids
	for (i=0, l=terms.length; i<l; i++) {
		
		term = terms[i];
		
		if (!recordcache[term]) {
			record = recordcache[term] = get("W-" + term);
			if (record) {
				for (id in record) {
					ids[id] += 1;
				}
			}
		}
		
	}
	
	// Implement these raw score algorithms (input term and document, output score number):
	//   * count of terms present in text (simple hit count)
	//   * word distance from beginning of document to first hit 
	//   * distance between term words in matching document (only for multi-term searches)
	//  for each of these categories:
	//   * title
	//   * selection
	//   * priority
	//   * content
	
	// Determine useful weightings
	
	// Display search results, highlighted appropriately
	$results.empty();
	var re = new RegExp('(.*?\\b)(' + terms.join('|') + ')(\\b.*)');
	for (id in ids) {
		
		var
			url = get("ID-" + id),
			doc = get("URL-" + url),
			text = doc.text,
			buf = [],
			pos = 0,
			size = 0,
			match = text.match(re);
		
		// split text on matches
		while (match) {
			buf[pos++] = match[1];
			buf[pos++] = match[2];
			size += match[1].length + match[2].length;
			text = match[3];
			match = text.match(re);
			if (pos > 10 || size > 300) {
				break;
			}
		}
		buf[pos++] = text;
		
		// build output
		var $dd = $('<dd></dd>');
		for (i=0; i<pos; i++) {	
			if (i % 2) {
				$dd.append($('<strong></strong>').text(buf[i]));
			} else {
				var seg = buf[i];
				if (seg.length > 100) {
					seg =
						(i ? seg.substr(0, 47) : '') +
						' ... ' + 
						(i < pos - 1 ? seg.substr(seg.length - 47) : '');
				}
				$dd.append(document.createTextNode(seg));
			}
		}
		
		$results.append(
			$('<dt><a></a></dt>')
				.find('a')
					.attr('href', url)
					.attr('title', doc.title)
					.text(doc.title)
				.end(),
			$dd
		);
	}
	
}

// attach search action to form submission
$('form').submit(search);

// focus on the search input
$(function(){
	$input.focus();
});

// exports
tenk.wordcount = wordcount;
tenk.normalize = normalize;

})(window,document,window['10kse'],jQuery);

