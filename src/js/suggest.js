/**
 * suggest.js
 */
(function(tenk,undefined){

var
	
	// storage api
	get = tenk.get,
	
	// trie implementation
	trie = tenk.trie,
	
	// word data, trie instance, and count of urls
	data,
	trieobj,
	count;

/**
 * get array of suggestions based on input string.
 * @param {string} query The value entered for which to find suggestions.
 */
function suggest(query) {
	
	// trim query
	query = query.replace(/^\s+|\s$/g, '').toLowerCase();
	
	var c = get("COUNT") || 0;
	
	// short-circuit if query is empty or if there is less than one element in storage
	if (!query || !c) {
		return [];
	}
	
	// on init, or if count has changed, create a trie object
	if (c !== count) {
		data = get("ALL");
		trieobj = trie(data);
	}
	
	// return first few trie matches
	return trieobj.match(query).slice(0,15);
	
}

// exports
tenk.suggest = suggest;	// short circuit if there are no matches

})(window['10kse']);
