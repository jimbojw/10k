/**
 * levenshtein.js - implements searching a trie for matches by levenshtein distance
 */
(function(tenk,undefined){

/**
 * search for matching strings up to the specified levenshtein distance.
 * @param {string} s The string to match.
 * @param {int} dist The maximum allowable levenshtein distance.
 * @return {array} A sorted list of matching strings (may be empty).
 */
function levenshtein(s, dist) {
	
	s = s.toLowerCase();
	
	var
		
		// length of string to match
		len = s.length,
		
		// char buffer
		buf = s.split(''),
		
		// matching strings found
		matches = {},
		
		// arrayified matches
		result = [],
		count = 0,
		
		// queue of nodes to scan
		queue = [
			[
				this.data, // node
				"",        // prefix
				dist,      // distance
				0          // position
			]
		],
		
		// iteration vars
		item,
		node,
		prefix,
		pos,
		ch,
		k;
	
	while (queue.length) {
		
		item = queue.shift();
		node = item[0];
		prefix = item[1];
		dist = item[2];
		pos = item[3];
		
		if (pos === len) {
			
			if (node.$) {
				
				// at end of string, add legit word
				matches[prefix] = true;
				
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
	
	for (k in matches) {
		result[count++] = k;
	}
	
	result.sort();
	
	return result;
	
}

// exports
tenk.levenshtein = levenshtein;

})(window['10kse']);

