/**
 * suggest.js
 */
(function(window,tenk,undefined){

var
	
	// storage api
	storage = window.localStorage,
	get = tenk.get,
	
	// trie implementation
	trie = tenk.trie,
	
	// cache of words
	wordcache,
	keycount;

/**
 * get array of suggestions based on input string.
 * @param {string} query The value entered for which to find suggestions.
 */
function suggest(query) {
	
	// trim query
	query = query.replace(/^\s+|\s$/g, '').toLowerCase();
	
	// short-circuit if query is empty or if there is less than one element in storage
	if (!query || !storage.length) {
		return [];
	}
	
	var
		
		// all words data (trie structure)
		data = get("ALL"),
		
		// trie for data lookup
		t = trie(data);
	
	// return first few trie matches
	return t.match(query).slice(0,15);
	
}

// exports
tenk.suggest = suggest;	// short circuit if there are no matches

})(window,window['10kse']);
