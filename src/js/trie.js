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
 * creates a trie around a given data structure.
 */
function trie(data) {
	
	return {
		add: add,
		data: data,
		find: find,
		match: match
	};
	
}

// exports
tenk.trie = trie;

})(window['10kse'],jQuery);

