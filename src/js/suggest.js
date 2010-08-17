/**
 * suggest.js
 */
(function(window,tenk,undefined){

var
	
	// storage api
	storage = window.localStorage,
	get = tenk.get,
	
	// cache of words
	wordcache,
	keycount;

/**
 * retrieves a list of known words.
 */
function allwords() {
	
	// TODO: keep a localStorage var filled with all words
	
	var count = storage.length;
	
	if (count === keycount) {
		return wordcache;
	}
	
	keycount = count;
	wordcache = [];
	count = 0;
	
	for (var i=0; i<keycount; i++) {
		
		var key = storage.key(i);
		
		if (key.indexOf('W-') === 0) {
			wordcache[count++] = key.substr(2);
		}
		
	}
	
	wordcache.sort();
	
	return wordcache;
	
}

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
		
		words = allwords(),
		len = words.length,
		
		// low and high bounds for binary search
		low = 0,
		high = len - 1,
		mid;
	
	// find first word that starts with query
	while (high - low > 1) {
		
		mid = low + ((high - low) >> 1);
		
		if (words[mid] <= query) {
			low = mid;
		} else {
			high = mid;
		}
		
	}
	
	// first matching word will either be low or high
	var start;
	if (words[low].indexOf(query) === 0) {
		start = low;
	} else if (words[high].indexOf(query) === 0) {
		start = high;
	} else {
		// short-circit if there are no matches
		return [];
	}
	
	// find the last word, up to 20
	var end = start + 16 > len ? len - 1 : start + 15;
	while (words[end].indexOf(query) !== 0) {
		end--;
	}
	
	return words.slice(start, end);
	
}

// exports
tenk.suggest = suggest;	// short circuit if there are no matches

})(window,window['10kse']);
