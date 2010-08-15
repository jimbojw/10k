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
		l,
		
		// term being evaluated;
		term,
		len,
		
		// count of how many of this term have been found
		count,
		
		// current position
		pos;
	
	// find first few positions of terms
	for (i=0, l=terms.length; i<l; i++) {
		
		term = terms[i];
		len = term.length;
		
		if (len > 2 && !seen[term]) {
			
			seen[term] = true;
			
			count = 0;
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
		maxsize = 200,
		
		// maximum allowable segment size
		maxseg = 50,
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
		
		// truncate the segment if it's too long
		if (truncate) {
			
			// first segment may be left truncated
			if (i === 0) {
				
				if (slen > maxseg) {
					
					segment = '... ' + segment.substr(slen - maxseg - 4);
					
				}
			
			// last segment may be right truncated
			} else if (i === len) {
				
				if (slen > maxseg) {
					
					segment = segment.substr(0, maxseg - 4) + ' ...';
					
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
	
	// trailing ellipse if early break
	if (size >= maxsize && i <= len) {
		buf[buf.length] = " ...";
	}
	
	// concatenate buffer to get output string
	return buf.join(' ');
	
}

/**
 * search form behavior
 */
function search(e) { 
	
	e.preventDefault();
	
	var
		
		// retrieve search query
		query = $input.val() || '',
		
		// extract terms from supplied search input string
		terms = query.toLowerCase().split(/[^a-z0-9_]/),
		
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
					ids[id] = (ids[id] || 0) + 1;
				}
			}
		}
		
	}
	
	var
		
		// references to library functions
		wordcount = tenk.wordcount,
		normalize = tenk.normalize,
		
		// scoring
		rankings = [
			
			// count the number of terms in the query which appear at least once
			[1.0, normalize(ids)],
			
			// count number of times terms appear in the documents
			[1.0, normalize(wordcount(ids, terms, "s", recordcache))],
			[1.0, normalize(wordcount(ids, terms, "t", recordcache))],
			[1.0, normalize(wordcount(ids, terms, "p", recordcache))],
			[1.0, normalize(wordcount(ids, terms, "c", recordcache))]
			
		],
		
		totals = {};
	
	// aggregate scores
	for (i=0, l=rankings.length; i<l; i++) {
		
		var
			pair = rankings[i],
			weight = pair[0],
			scores = pair[1];
		
		for (id in scores) {
			
			if (!totals[id]) {
				totals[id] = 0;
			}
			
			totals[id] += weight * scores[id];
			
		}
	}
	
	var
		
		// list of scores, and count of number
		ranks = [],
		count = 0,
		
		// inverted index mapping scores to ids
		inverse = {};
	
	// invert id/scores for display
	for (id in totals) {
		ranks[count++] = totals[id];
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
	
	// Display search results, highlighted accordingly
	$results.empty();
	for (id in ids) {
		
		var
			url = get("ID-" + id),
			doc = get("URL-" + url),
			text = doc.text;
		
		$results.append(
			$('<dt><a></a></dt>')
				.find('a')
					.attr('href', url)
					.attr('title', doc.title)
					.text(highlight(doc.title, terms, false))
				.end(),
			$('<dd><p></p></dd>')
				.find('p')
					.html(highlight(text, terms))
				.end()
				.append('<p><strong>Score: ' + totals[id] + '</strong></p>')
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
tenk.highlight = highlight;

})(window,document,window['10kse'],jQuery);

