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
	
	// cached jquery results
	$results = $('.results dl'),
	$input = $('.search input'),
	
	// scratch pad for html special character conversion
	$scratch = $('<div></div>');

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
 * highlight terms in the provided text.
 * @param {string} text The text to highlight.
 * @param {array} terms An array of terms to highlight.
 * @param {boolean} truncate Whether to truncate the output (defaults to true).
 */
function highlight(text, terms, truncate) {
	
	// default behavior is to truncate
	if (truncate === undefined) {
		truncate = true;
	}
	
	// convert html special characters to entities
	text = $scratch.text(text).html();
	
	var
		
		// memory of whether we've seen this term before
		seen = {},
		
		// mapping of indexes to terms
		index = {},
		
		// flat list of positions for sorting
		flat = [],
		
		// number of term matches to find before terminating the loop
		limit = 3,
		
		// iteration vars
		i,
		l;
	
	// find first few positions of terms
	for (i=0, l=terms.length; i<l; i++) {
		
		var 
			term = terms[i],
			len = term.length;
		
		if (len > 2 && !seen[term]) {
			
			seen[term] = true;
			
			var
				
				// count of how many of this term have been found
				count = 0,
				
				// latest position
				pos = 0;
			
			while (count < limit) {
				
				// find the next match
				pos = text.indexOf(term, pos);
				
				// abort if there are none
				if (pos === -1) {
					break;
				}
				
				// grab the characters preceeding and succeeding the match
				var
					before = text.charAt(pos - 1).toLowerCase(),
					after = text.charAt(pos + len).toLowerCase();
				
				// check that they're not 'word' characters
				if (
					(before < 'a' || before > 'z') &&
					(after < 'a' || after > 'z')
				) {
					
					count++;
					flat[flat.length] = pos;
					index[pos] = term;
					
				}
				
				// increment pos to skip past the last match
				pos += len;
				
			}
			
		}
	}
	
	// sort the matches
	flat.sort();
	
	var
		
		// buffer to hold segments and cumulative size of segments so far
		buf = [],
		size = 0,
		
		// maximum allowable blurb size
		maxsize = 2000,
		
		// maximum allowable segment size
		maxseg = 10,
		doubleseg = maxseg * 2;
	
	// build out a buffer
	len = flat.length;
	pos = 0;
	i = 0;
	while (size < maxsize && i <= len) {
		
		// grab the text segment
		var
			loc = flat[i],
			segment = ( i < len ? text.substr(pos, loc - pos) : text.substr(pos) ),
			slen = segment.length;
		
		// first segment may be left truncated
		if (i === 0) {
			
			if (slen > maxseg) {
				
				segment = '... ' + segment.substr(slen - maxseg - 4);
				
			}
		
		// last segment may be right truncated
		} else if (i === len) {
			
			if (slen > maxseg) {
				
				segment = segment.substr(0, slen - maxseg - 4) + ' ...';
				
			}
			
		// middle segments may have middles shortened
		} else {
			
			if (slen > doubleseg) {
				
				segment =
					segment.substr(0, maxseg - 3) + 
					" ... " + 
					segment.substr(slen - maxseg - 3);
				
			}
			
		}
		
		// add segment to buffer
		buf[buf.length] = segment;
		size += segment.length;
		
		// add term to buffer
		if (i < len) {
			
			term = index[loc];
			buf[buf.length] = '<b>' + term + '</b>';
			size += term.length;
			pos = loc + term.length;
			
		}
		
		// increment flat iterator
		i++;
	}
	
	// concatenate buffer to get output string
	return buf.join('');
	
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
tenk.highlight = highlight;

})(window,document,window['10kse'],jQuery);

