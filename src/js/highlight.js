/**
 * highlight.js
 */
(function(tenk,$,undefined){

var
	
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
	text = $scratch.text(text).html(),
	lc = text.toLowerCase();
	
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
		
		term = terms[i].toLowerCase();
		len = term.length;
		
		if (len > 2 && !seen[term]) {
			
			seen[term] = true;
			
			count = 0;
			pos = 0;
			
			while (count < limit) {
				
				// find the next match
				pos = lc.indexOf(term, pos);
				
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
			buf[buf.length] = '<b>' + text.substr(loc, term.length) + '</b>';
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

// exports
tenk.highlight = highlight;

})(window['10kse'],jQuery);

