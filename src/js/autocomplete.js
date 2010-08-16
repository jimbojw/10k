/**
 * autocomplete.js - stripped-down implementation of autocomplete.
 */
(function(window,tenk,$,undefined){

/**
 * get array of suggestions based on input string.
 * @param {string} query The value entered for which to find suggestions.
 */
function suggestions(query) {
	
	// TODO: implement me!!
	
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
			.appendTo(document.body);
	
	// capture keyup and change on input
		
		// clear timeout if already set
		
		// set timeout for duration, then update choices
		
	// update choices
		
		// get suggestions
		
		// fill in suggestions in drop-down
		
	
}

// set up input box for autocompletion
$('.search input').each(function(){
	autocomplete(this);
});

// exports
tenk.autocomplete = autocomplete;
tenk.suggestions = suggestions;

})(window,window['10kse'],jQuery);
