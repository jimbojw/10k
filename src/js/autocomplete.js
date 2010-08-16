/**
 * autocomplete.js - stripped-down implementation of autocomplete.
 */
(function(window,tenk,$,undefined){

/**
 * get array of suggestions based on input string.
 * @param {string} query The value entered for which to find suggestions.
 */
function suggest(query) {
	
	// TODO: implement me!!
	return [
		query,
		query + 'a',
		query + 'b',
		query + 'c',
		query + 'd',
	];
	
}

/**
 * autocomplete instrumentation.
 * @param {element} input The input element to autocomplete.
 */
function autocomplete(input) {
	
	
	var
		
		// grab input and position
		$input = $(input),
		offset = $input.offset(),
		
		// create drop-down structure
		$dd = $('<div class="auto"><ul></ul></div>')
			.css({
				top: offset.top + input.offsetHeight,
				left: offset.left,
				width: input.offsetWidth,
				display: 'none'
			})
			.appendTo(document.body),
		$ul = $dd.find('ul'),
		
		// previous input value
		previous = '';
	
	/**
	 * update available choices.
	 * @param {array} sugs List of suggestions.
	 * @param {string} word Word typed to produce suggestions.
	 */
	function update(suggestions, word) {
		
		$ul.empty();
		
		var len = word.length;
		
		// fill in suggestions
		for (var i=0, l=suggestions.length; i<l; i++) {
			
			var suggestion = suggestions[i];
			
			$('<li><span></span></li>')
				.appendTo($ul)
				.find('span')
					.html(
						suggestion.split(word, 2).join('<b>' + word + '</b>')
					);
			
		}
		
		$dd.show();
		
	}
	
	/**
	 * handler to capture modifications to input and key navigation.
	 * @param {event} e The jQuery wrapped event that was fired.
	 */
	function modified(e) {
		
		var value = $input.val();
		
		if (value !== previous) {
			
			previous = value;
			
			var
				
				// extract last word of input
				pos = value.lastIndexOf(' '),
				word = value.substr(pos < 0 ? 0 : pos),
				
				// get suggestions
				suggestions = suggest(word);
			
			// update choices
			if (suggestions.length) {
				update(suggestions, word.toLowerCase());
			}
			
		}
		
	}
	
	// wire up modification handler
	$input
		.change(modified)
		.keyup(modified);
	
}

// set up input box for autocompletion
$('.search input').each(function(){
	autocomplete(this);
});

// exports
tenk.autocomplete = autocomplete;
tenk.suggest = suggest;

})(window,window['10kse'],jQuery);
