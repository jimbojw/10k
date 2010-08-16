/**
 * suggest.js
 */
(function(tenk,undefined){

/**
 * get array of suggestions based on input string.
 * @param {string} query The value entered for which to find suggestions.
 */
function suggest(query) {
	
	query = query.replace(/^\s+|\s$/g, '');
	
	if (!query) {
		return [];
	}
	
	// TODO: implement me!!
	return [
		query,
		query + 'a',
		query + 'b',
		query + 'c',
		query + 'd'
	];
	
}

// exports
tenk.suggest = suggest;

})(window['10kse']);
