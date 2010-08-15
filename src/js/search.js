/**
 * search.js
 */
(function(window,document,tenk,$,undefined){

var
	
	// storage api
	get = tenk.get,
	
	// stop words
	stop = tenk.stop,
	
	// serialization api
	stringify = JSON.stringify,
	
	// cached jquery results
	$results = $('.results dl'),
	$input = $('.search input');

/**
 * search form behavior
 */
function search(e) { 
	
	e.preventDefault();
	
	var
		
		// retrieve search query
		query = $input.val() || '',
		
		// extract terms from supplied search input string
		terms = query.toLowerCase().split(/[^a-z0-9_]/),
		
		// iteration vars
		i,
		l,
		term,
		record,
		
		// matching document ids
		ids = {},
		id,
		
		// record cache
		recordcache = {};
	
	// collect matching document ids
	for (i=0, l=terms.length; i<l; i++) {
		
		term = terms[i];
		
		if (!recordcache[term]) {
			record = recordcache[term] = get("W-" + term);
			if (record) {
				for (id in record) {
					ids[id] = (ids[id] || 0) + 1;
				}
			}
		}
		
	}
	
	var
		
		// references to library functions
		wordcount = tenk.wordcount,
		normalize = tenk.normalize,
		
		// scoring
		rankings = [
			
			// count the number of terms in the query which appear at least once
			[1.0, normalize(ids)],
			
			// count number of times terms appear in the documents
			[1.0, normalize(wordcount(ids, terms, "s", recordcache))],
			[1.0, normalize(wordcount(ids, terms, "t", recordcache))],
			[1.0, normalize(wordcount(ids, terms, "p", recordcache))],
			[1.0, normalize(wordcount(ids, terms, "c", recordcache))]
			
		],
		
		totals = {};
	
	// aggregate scores
	for (i=0, l=rankings.length; i<l; i++) {
		
		var
			pair = rankings[i],
			weight = pair[0],
			scores = pair[1];
		
		for (id in scores) {
			
			if (!totals[id]) {
				totals[id] = 0;
			}
			
			totals[id] += weight * scores[id];
			
		}
	}
	
	var
		
		// list of scores, and count of number
		ranks = [],
		count = 0,
		
		// inverted index mapping scores to ids
		inverse = {},
		
		// weighted total score
		score,
		
		// entry in the inverse ranks table
		entry;
	
	// invert id/scores for display
	for (id in totals) {
		score = totals[id];
		entry = inverse[score] || (inverse[score] = []);
		entry[entry.length] = id;
		ranks[count++] = score;
	}
	
	// sort matches by rank, descending
	ranks.sort(tenk.asc);
	ranks.reverse();
	
	// Implement these raw score algorithms (input term and document, output score number):
	//   * count of terms present in text (simple hit count)
	//   * word distance from beginning of document to first hit 
	//   * distance between term words in matching document (only for multi-term searches)
	//  for each of these categories:
	//   * title
	//   * selection
	//   * priority
	//   * content
	
	var
		
		// highlight function
		highlight = tenk.highlight,
		
		// last score 
		last = null;
	
	// display search results in rank order, highlighted accordingly
	$results.empty();
	for (i=0, l=ranks.length; i<l; i++) {
		
		score = ranks[i];
		if (score !== last) {
			
			last = score;
			entry = inverse[score];
			
			for (var j=0, m=entry.length; j<m; j++) {
				
				id = entry[j];
				
				var
					url = get("ID-" + id),
					doc = get("URL-" + url),
					text = doc.text;
				
				$results.append(
					$('<dt><a></a></dt>')
						.find('a')
							.attr('href', url)
							.attr('title', doc.title)
							.html(highlight(doc.title, terms, false))
						.end(),
					$('<dd><p></p></dd>')
						.find('p')
							.html(highlight(text, terms))
						.end()
						.append('<p><strong>Score: ' + (totals[id] + '').substr(0,4) + '</strong></p>')
				);
				
			}
			
		}
		
	}
	
}

// attach search action to form submission
$('form').submit(search);

// focus on the search input
$(function(){
	$input.focus();
});

// exports
tenk.highlight = highlight;

})(window,document,window['10kse'],jQuery);

