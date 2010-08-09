/**
 * search.js
 */
(function(tenk,$){

var
	
	// local refs to local storage api
	get = tenk.get,
	set = tenk.set,
	
	// document characteristics
	id = get("COUNT") || 0,
	url,
	doc;

// show pages added so far, in reverse chronological order
if (id > 0) {
	
	var list = $('<ul></ul>')
		.appendTo(
			$('.entries')
				.find('span')
					.remove()
				.end()
		).get(0);
	
	while (id > 0) {
		id--;
		url = get("ID-" + id);
		doc = get("URL-" + url);
		$('<li><a></a></li>')
			.find('a')
				.attr('href', url)
				.attr('title', doc.title)
				.text(doc.title)
			.end()
			.appendTo(list);
	}
}

// search form behavior
$('form').submit(function(e){
	
	e.preventDefault();
	
	// TODO: Implement me
	
});


})(window['10kse'],jQuery);

