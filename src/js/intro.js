/**
 * intro.js
 */
(function(window){


var
	
	// storage api
	storage = window.localStorage,
	
	// serialization api
	stringify = window.JSON.stringify,
	parse = window.JSON.parse,
	
	// establish 10k search engine namespace
	tenk = window['10kse'] = {};

/**
 * get an item from localStorage.
 */
function get(key) {
	var value = storage.getItem(key);
	return value ? parse(value) : value;
}

/**
 * put an item into localStorage
 */
function set(key, value) {
	return storage.setItem(key, stringify(value));
}

// export
tenk.get = get;
tenk.set = set;

})(window);
