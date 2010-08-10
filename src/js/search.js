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
	$results = $('.results dl'),
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
		terms = text.toLowerCase().split(/[^a-z0-9_]/),
		
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
	
	// Implement these raw score algorithms (input term and document, output score number):
	//   * count of terms present in text (simple hit count)
	//   * word distance from beginning of document to first hit 
	//   * distance between term words in matching document (only for multi-term searches)
	//  for each of these categories:
	//   * title
	//   * selection
	//   * priority
	//   * content
	
	// Determine useful weightings
	
	// Display search results, highlighted appropriately
	$results.empty();
	var re = new RegExp('(.*?\\b)(' + terms.join('|') + ')(\\b.*)');
	for (id in ids) {
		
		var
			url = get("ID-" + id),
			doc = get("URL-" + url),
			text = doc.text,
			buf = [],
			pos = 0,
			size = 0,
			match = text.match(re);
		
		// split text on matches
		while (match) {
			buf[pos++] = match[1];
			buf[pos++] = match[2];
			size += match[1].length + match[2].length;
			text = match[3];
			match = text.match(re);
			if (pos > 10 || size > 300) {
				break;
			}
		}
		buf[pos++] = text;
		
		// build output
		var $dd = $('<dd></dd>');
		for (i=0; i<pos; i++) {	
			if (i % 2) {
				$dd.append($('<strong></strong>').text(buf[i]));
			} else {
				var seg = buf[i];
				if (seg.length > 100) {
					seg =
						(i ? seg.substr(0, 47) : '') +
						' ... ' + 
						(i < pos - 1 ? seg.substr(seg.length - 47) : '');
				}
				$dd.append(document.createTextNode(seg));
			}
		}
		
		$results.append(
			$('<dt><a></a></dt>')
				.find('a')
					.attr('href', url)
					.attr('title', doc.title)
					.text(doc.title)
				.end(),
			$dd
		);
	}
	
});


})(window['10kse'],jQuery);

