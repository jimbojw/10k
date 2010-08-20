/**
 * ranking.js
 */
(function(tenk,undefined){

var
	
	// storage api
	get = tenk.get,
	
	// so-called stop words (uninteresting to search/ranking)
	stop = tenk.stop,
	
	// maths
	log = Math.log;

/**
 * normalize a set of scores.
 * @param {object} scores Hash containing id/score pairs.
 * @param {int} multiplier Number to multiply each score by prior to normalization (accounts for direction, -1 for lower-is-better).
 * @param {float} fallback Fall back value to use if all the scores are identical (defaults to 0.5).
 * @return {object} scores Hash containing id/normalized score pairs (highest is best, 0-1 range).
 */
function normalize(scores, multiplier, fallback) {
	
	if (multiplier === undefined) {
		multiplier = 1;
	}
	
	if (fallback === undefined) {
		fallback = 0.5;
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
	
	if (high === low) {
		for (id in normalized) {
			normalized[id] = fallback;
		}
		return normalized;
	}
	
	spread = 1 / (high - low);
	
	for (id in normalized) {
		normalized[id] = (normalized[id] - low) * spread;
	}
	
	return normalized;
}

/**
 * how close is the closest word to the top of the content
 * @param {object} ids Hash in which keys are document ids (values unimportant).
 * @param {array} terms List of search terms provided.
 * @param {string} type The type of content to count ('s'election, 't'itle, 'p'riority, or 'c'ontent).
 * @param {object} recordcache Hash mapping words to their localStorage values.
 * @return {object} Hash of id/score pairs.
 */
function topdistance(ids, terms, type, recordcache) {
	
	if (!recordcache) {
		recordcache = {};
	}
	
	var
		scores = {},
		term,
		record,
		id,
		entry,
		positions,
		low;
	
	for (id in ids) {
		
		low = null;
		
		for (var i=0, l=terms.length; i<l; i++) {
			
			term = terms[i];
			if (term.length > 2 && !stop[term]) {
				
				record = recordcache[term];
				
				if (record === undefined) {
					record = recordcache[term] = get("W-" + term);
				}
				
				if (record) {
					
					entry = record[id];
					if (entry) {
						
						positions = entry[type];
						if (positions) {
							
							if (low === null || positions[0] < low) {
								low = positions[0];
							}
							
						}
						
					}
					
				}
				
			}
			
		}
		
		if (low !== null) {
			scores[id] = low;
		}
		
	}
	
	return scores;
	
}

/**
 * implementation of sphinx's modified bm25 algorithm.
 * @param {object} ids Hash in which keys are document ids (values unimportant).
 * @param {array} terms List of search terms provided.
 * @param {string} type The type of content to count ('s'election, 't'itle, 'p'riority, or 'c'ontent).
 * @param {object} recordcache Hash mapping words to their localStorage values.
 * @return {object} Hash of id/score pairs.
 */
function bm25(ids, terms, type, recordcache) {
	
	/* sphinx pseudo code
	 * ref: http://sphinxsearch.com/blog/2010/08/17/how-sphinx-relevance-ranking-works/
	BM25 = 0
	foreach ( keyword in matching_keywords )
	{
		n = total_matching_documents ( keyword )
		N = total_documents_in_collection
		k1 = 1.2
		 
		TF = current_document_occurrence_count ( keyword )
		IDF = log((N-n+1)/n) / log(1+N)
		BM25 = BM25 + TF*IDF/(TF+k1)
	}
	
	// normalize to 0..1 range
	BM25 = 0.5 + BM25 / ( 2*num_keywords ( query ) )
	*/
	
	if (!recordcache) {
		recordcache = {};
	}
	
	var
		scores = {},
		term,
		record,
		id,
		entry,
		positions,
		low,
		
		// count number of matching documents for each term (term/count)
		termcount = {},
		
		// count of all documents
		count = get("COUNT"),
		invlogcount = 1 / log(1 + count),
		
		// bm25 factors
		bm25score,
		k1 = 1.2,
		tf, // term frequency
		idf, // inverse document frequency
		denom = 1 / (2 * terms.length), // normalization denominator
		
		// iteration vars
		i,
		l;
	
	// count matching documents
	for (id in ids) {
		
		for (i=0, l=terms.length; i<l; i++) {
			
			term = terms[i];
			if (term.length > 2 && !stop[term]) {
				
				record = recordcache[term];
				
				if (record === undefined) {
					record = recordcache[term] = get("W-" + term);
				}
				
				if (record) {
					
					entry = record[id];
					if (entry) {
						
						positions = entry[type];
						if (positions) {
							
							termcount[term] = (termcount[term] || 0) + 1;
							
						}
						
					}
					
				}
				
			}
			
		}
		
	}
	
	for (id in ids) {
		
		bm25score = 0;
		
		for (i=0, l=terms.length; i<l; i++) {
			
			if (termcount[term]) {
				
				// calculate idf (same for all these matching docs for all terms)
				idf = log((count - termcount[term] + 1) / termcount[term]) * invlogcount;
				
				term = terms[i];
				if (term.length > 2 && !stop[term]) {
					
					tf = 0;
					
					record = recordcache[term];
					
					if (record) {
						
						entry = record[id];
						if (entry) {
							
							positions = entry[type];
							if (positions) {
								
								tf = positions.length;
								
							}
							
						}
						
					}
					
					if (tf) {
						bm25score += tf * idf / (tf + k1);
					}
				
				}
			
			}
			
			// add normalized score
			scores[id] = 0.5 + bm25score * denom;
			
		}
		
	}
	
	return scores;
	
}
 
/**
 * implementation of a sphinx-like phase proximity factor.
 * @param {object} ids Hash in which keys are document ids (values unimportant).
 * @param {array} terms List of search terms provided.
 * @param {string} type The type of content to count ('s'election, 't'itle, 'p'riority, or 'c'ontent).
 * @param {object} recordcache Hash mapping words to their localStorage values.
 * @return {object} Hash of id/score pairs.
 */
function proximity(ids, terms, type, recordcache) {
	
	var
		
		// scores to return
		scores = {},
		
		// id of current doc
		id,
		
		// current term
		term,
		
		// word/id record and type entry
		record,
		entry,
		
		// positions for current term in document
		positions,
		
		// current position within position list
		pos,
		
		// mixed list of word positions for all terms for a document
		list,
		
		// count of word positions
		count,
		
		// inverted index pointing positions to terms
		index,
		
		// iteration vars
		i,
		l,
		j,
		n,
		m;
	
	for (id in ids) {
		
		list = [];
		count = [];
		index = {};
		
		// build up index and list of positions for scan
		for (i=0, l=terms.length; i<l; i++) {
			
			term = terms[i];
			
			record = recordcache[term];
			
			if (record === undefined) {
				record = recordcache[term] = get("W-" + term);
			}
			
			if (record) {
				
				entry = record[id];
				if (entry) {
					
					positions = entry[type];
					if (positions) {
						
						for (j=0, n=positions.length; j<n; j++) {
							
							pos = positions[j];
							list[count++] = pos;
							index[pos] = term;
							
						}
						
					}
					
				}
				
			}
			
		}
		
		longest = 0;
		
		// scan back through index and list to find the longest sequence
		for (i=0, l=terms.length; i<l; i++) {
			
			term = terms[i];
			
			record = recordcache[term];
			
			if (record === undefined) {
				record = recordcache[term] = get("W-" + term);
			}
			
			if (record) {
				
				entry = record[id];
				if (entry) {
					
					positions = entry[type];
					if (positions) {
						
						for (j=0, n=positions.length; j<n; j++) {
							
							pos = positions[j];
							
							// current proximity length starts at one, because this term matched
							m = 1;
							
							while (
								// we haven't run off the end of the terms array
								i + m < l && 
								// and the next word matches the next term in the query
								index[pos + m] === terms[i + m]
							) {
								// increment m
								m++;
							}
							
							// if we've found a new winner, set it
							if (m > longest) {
								longest = m;
							}
							
						}
						
					}
					
				}
				
			}
			
			// short-circuit if we've found the longest possible match
			if (i + longest >= l) {
				break;
			}
			
		}
		
		// set score if a proximity sequence was found
		if (longest) {
			scores[id] = longest;
		}
		
	}
	
	return scores;
	
}

// exports
tenk.normalize = normalize;
tenk.topdistance = topdistance;
tenk.bm25 = bm25;
tenk.proximity = proximity;

})(window['10kse']);

