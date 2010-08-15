/**
 * ranking.js
 */
(function(tenk,undefined){

/**
 * normalize a set of scores.
 * @param {object} scores Hash containing id/score pairs.
 * @param {int} multiplier Number to multiply each score by prior to normalization (accounts for direction).
 * @return {object} scores Hash containing id/normalized score pairs (highest is best, 0-1 range).
 */
function normalize(scores, multiplier) {
	
	if (multiplier === undefined) {
		multiplier = 1;
	}
	
	var
		normalized = {},
		id,
		high,
		low,
		spread,
		s;
	
	for (id in scores) {
		s = normalized[id] = scores[id] * multiplier;
		if (high === undefined || s > high) {
			high = s;
		}
		if (low === undefined || s < low) {
			low = s;
		}
	}
	
	spread = 1 / (high - low);
	
	for (id in normalized) {
		normalized[id] = (normalized[id] - low) * spread;
	}
	
	return normalized;
}

/**
 * count how many times the terms appear in the document
 * @param {object} ids Hash in which keys are document ids (values unimportant).
 * @param {array} terms List of search terms provided.
 * @param {string} type The type of content to count ('s'election, 't'itle, 'p'riority, or 'c'ontent).
 * @param {object} recordcache Hash mapping words to their localStorage values.
 * @return {object} Hash of id/score pairs.
 */
function wordcount(ids, terms, type, recordcache) {
	
	if (!recordcache) {
		recordcache = {};
	}
	
	var
		scores = {},
		term,
		record,
		id,
		entry,
		positions;
	
	for (var i=0, l=terms.length; i<l; i++) {
		
		term = terms[i];
		if (term.length > 2 && !stop[term]) {
			
			record = recordcache[term] || (recordcache[term] = get("W-" + term));
			
			for (id in ids) {
				
				entry = record[id];
				if (entry) {
					
					positions = entry[type];
					if (positions) {
						if (scores[id] === undefined) {
							scores[id] = 0;
						}
						scores[id] += (+positions.length);
					}
					
				}
				
			}
			
		}
		
	}
	
	return scores;
	
}

// exports
tenk.wordcount = wordcount;
tenk.normalize = normalize;

})(window['10kse']);

