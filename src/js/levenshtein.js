/**
 * levenshtein.js - implements searching a trie for matches by levenshtein distance
 */
(function(tenk,undefined){

/**
 * search for matching strings up to the specified levenshtein distance.
 * @param {string} s The string to match.
 * @param {int} dist The maximum allowable levenshtein distance.
 * @return {array} A list of matching strings sorted by distance, then alphanumerically (may be empty).
 */
function levenshtein(s, tolerance) {
	
	s = s.toLowerCase();
	
	var
		
		// length of string to match
		len = s.length,
		
		// char buffer
		buf = s.split(''),
		
		// matching strings found
		matches = {},
		
		// queue of nodes to scan
		queue = [
			[
				this.data, // node
				"",        // prefix
				tolerance, // distance
				0          // position
			]
		],
		
		// iteration vars
		item,
		node,
		prefix,
		pos,
		ch,
		k,
		i;
	
	for (i = 0; i <= tolerance; i++) {
		matches[i] = {};
	}
	
	while (queue.length) {
		
		item = queue.shift();
		node = item[0];
		prefix = item[1];
		dist = item[2];
		pos = item[3];
		
		if (pos === len) {
			
			if (node.$) {
				
				// at end of string, add legit word
				matches[dist][prefix] = 1;
				
			}
			
			if (dist > 0) {
				
				for (k in node) {
					
					// allow longer words if we can tolerate more distance
					queue[queue.length] = [
						node[k],
						prefix + k,
						dist - 1,
						pos
					];
					
				}
				
			}
			
		} else {
			
			ch = buf[pos];
			
			if (dist > 0) {
				
				// try skipping this letter (letter missing)
				queue[queue.length] = [
					node,
					prefix,
					dist - 1,
					pos + 1
				];
				
				for (k in node) {
					
					if (k !== ch) {
						
						// letter mis-match
						queue[queue.length] = [
							node[k],
							prefix + k,
							dist - 1,
							pos + 1
						];
						
					}
					
					// letter added
					queue[queue.length] = [
						node[k],
						prefix + k,
						dist - 1,
						pos
					];
					
				}
				
			}
			
			if (node[ch]) {
				
				// letter match
				queue[queue.length] = [
					node[ch],
					prefix + ch,
					dist,
					pos + 1
				];
				
			}
			
		}
		
	}
	
	var
		
		// iteration vars
		row,
		list,
		count,
		
		// arrayified result
		result = [],
		total = 0,
		
		// all seen words so far
		all = {},
		
		// push function
		push = [].push;
	
	// collect sorted matches
	for (i = tolerance; i >= 0; i--) {
		
		row = matches[i];
		list = [];
		count = 0;
		
		for (k in row) {
			if (!all[k]) {
				list[count++] = k;
				all[k] = 1;
			}
		}
		
		list.sort();
		
		push.apply(result, list);
		
	}
	
	return result;
	
}

// exports
tenk.levenshtein = levenshtein;

})(window['10kse']);

