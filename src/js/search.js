/**
 * search.js
 */
(function(tenk,$){

var
	
	// storage api
	get = tenk.get,
	
	// serialization api
	stringify = JSON.stringify;
	
	// cached jqueri results
	$results = $('.results div'),
	$input = $('.search input');

// focus on the search input
$(function(){
	$input.focus();
});

// search form behavior
$('form').submit(function(e){
	
	e.preventDefault();
	
	var
		
		// extract terms from supplied search input string
		text = $input.val() || '',
		terms = text.split(/[^a-z0-9_]/i),
		
		// iteration vars
		i,
		l,
		term,
		record,
		
		// matching document ids
		id,
		ids = {},
		count;
	
	// collect matching document ids
	for (i=0, l=terms.length; i<l; i++) {
		
		term = terms[i].toLowerCase();
		record = get("W-" + term);
		
		if (record) {
			for (id in record) {
				if (!ids[id]) {
					count++;
					ids[id] = true;
				}
			}
		}
		
	}
	
	// TODO
	//   Impement these raw score algorithms (input term and document, output score number):
	//     * count of terms present in text (simple hit count)
	//     * word distance from beginning of document to first hit 
	//     * distance between term words in matching document (only for multi-term searches)
	//   for each of these categories:
	//     * title
	//     * selection
	//     * priority
	//     * content
	//   Determine useful weightings
	//   Display search results, highlighted appropriately
	
});


})(window['10kse'],jQuery);

