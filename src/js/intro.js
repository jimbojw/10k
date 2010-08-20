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
	tenk = window['10kse'] = {},
	
	// so-called "stop" words (uninteresting to a search application)
	stopwords = "able|about|across|after|all|almost|also|among|and|any|are|because|been|but|can|cannot|could|dear|did|does|either|else|ever|every|for|from|get|got|had|has|have|her|hers|him|his|how|however|into|its|just|least|let|like|likely|may|might|most|must|neither|nor|not|off|often|only|other|our|own|rather|said|say|says|she|should|since|some|than|that|the|their|them|then|there|these|they|this|tis|too|twas|wants|was|were|what|when|where|which|while|who|whom|why|will|with|would|yet|you|your".split("|"),
	stop = {};

// build stop hash
for (var i=0, l=stopwords.length; i<l; i++) {
	stop[stopwords[i]] = true;
}

/**
 * get an item from localStorage.
 */
function get(key) {
	var value = storage.getItem('10kse-' + key);
	return value ? parse(value) : value;
}

/**
 * put an item into localStorage
 */
function set(key, value) {
	return storage.setItem('10kse-' + key, stringify(value));
}

/**
 * numeric difference - used in sorting arrays numerically.
 */
function asc(a,b){
	return a - b;
}

// exports
tenk.asc = asc;
tenk.get = get;
tenk.set = set;
tenk.stop = stop;

})(window);
