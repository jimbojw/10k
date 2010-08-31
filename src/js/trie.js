/**
 * trie.js
 */
(function(tenk,$,undefined){

/**
 * implementation of the add member.
 * @param {string} s The string to add.
 */
function add(s) {
	
	var
		node = this.data,
		next,
		ch;
	
	for (var i=0, l=s.length; i<l; i++) {
		
		ch = s.charAt(i);
		next = node[ch];
		
		if (!next) {
			next = node[ch] = {};
		}
		
		node = next;
		
	}
	
	node.$ = 1;
	
}

/**
 * find a node by matching characters.
 * @param {string} s The string to find.
 * @return {mixed} Either the matching node, or null if not found.
 */
function find(s) {
	
	var
		node = this.data,
		next,
		ch;
	
	for (var i=0, l=s.length; i<l; i++) {
		
		ch = s.charAt(i);
		next = node[ch];
		
		if (!next) {
			return null;
		}
		
		node = next;
		
	}
	
	return node;
	
}

/**
 * grab previously added strings starting with the query string.
 * @param {string} s The string to match.
 * @return {array} An array of matching strings (may be empty).
 */
function match(s) {
	
	var node = this.find(s);
	
	if (!node) {
		return [];
	}
	
	var
		queue = [[s, node]],
		result = [],
		count = 0,
		pair,
		ch;
	
	while (queue.length) {
		
		pair = queue.shift();
		s = pair[0];
		node = pair[1];
		
		if (node.$) {
			result[count++] = s;
		}
		
		for (ch in node) {
			if (ch !== '$') {
				queue[queue.length] = [s + ch, node[ch]];
			}
		}
		
	}
	
	result.sort();
	
	return result;
	
}

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

/**
 * creates a trie around a given data structure.
 * @param {object} data Trie data.
 * @return {object} A trie for the given data.
 */
function trie(data) {
	
	return {
		add: add,
		data: data,
		find: find,
		levenshtein: levenshtein,
		match: match
	};
	
}

// exports
tenk.trie = trie;

})(window['10kse'],jQuery);

