/**
 * autocomplete.js - stripped-down implementation of autocomplete.
 */
(function(window,tenk,$,undefined){

var
	
	// key codes
	upkey = 38,
	downkey = 40,
	enterkey = 13;

/**
 * get array of suggestions based on input string.
 * @param {string} query The value entered for which to find suggestions.
 */
function suggest(query) {
	
	query = query.replace(/^\s+|\s$/g, '');
	
	if (!query) {
		return [];
	}
	
	// TODO: implement me!!
	return [
		query,
		query + 'a',
		query + 'b',
		query + 'c',
		query + 'd'
	];
	
}

/**
 * autocomplete instrumentation.
 * @param {element} input The input element to autocomplete.
 */
function autocomplete(input) {
	
	var
		
		$input = $(input),
		
		// create drop-down structure
		$dd = $('<div class="auto"><ul></ul></div>')
			.css({
				display: 'none'
			})
			.appendTo(document.body),
		$ul = $dd.find('ul'),
		
		// previous input value
		previous = '',
		
		// currently selected option
		$selected = null;
	
	/**
	 * action to take when the user selects an option.
	 */
	function select() {
		
		if ($selected) {
			
			var
				word = $selected.text(),
				value = $input.val(),
				pos = value.lastIndexOf(' ') + 1;
			
			$input.get(0).value = previous = value.substr(0, pos) + word;
			
			hide();
		}
		
	}
	
	/**
	 * update available choices.
	 * @param {array} sugs List of suggestions.
	 * @param {string} word Word typed to produce suggestions.
	 */
	function update(suggestions, word) {
		
		$ul.empty();
		
		$selected = null;
		
		var len = word.length;
		
		// fill in suggestions
		for (var i=0, l=suggestions.length; i<l; i++) {
			
			$('<li><span></span></li>')
				.appendTo($ul)
				.find('span')
					.html(
						suggestions[i].split(word, 2).join('<b>' + word + '</b>')
					);
			
		}
		
		show();
		
	}
	
	/**
	 * handler to capture modifications to input and key navigation.
	 * @param {event} e The jQuery wrapped event that was fired.
	 */
	function modified(e) {
		
		var
			value = $input.val(),
			which = e.which,
			sel = 'selected';
		
		if (value !== previous) {
			
			previous = value;
			
			var
				
				// extract last word of input
				pos = value.lastIndexOf(' '),
				word = value.substr(pos < 0 ? 0 : pos).toLowerCase();
			
			if (word.length) {
				
				var
					// get suggestions
					suggestions = suggest(word);
				
				// update choices
				if (suggestions && suggestions.length) {
					update(suggestions, word);
				} else {
					hide();
				}
				
			} else {
				
				hide();
				
			}
			
			
		} else if (which === upkey || which === downkey) {
			
			
			if ($selected) {
				
				if (which === upkey) {
					
					var $prev = $selected.prev();
					if ($prev.length) {
						
						$selected.removeClass(sel);
						$selected = $prev.addClass(sel);
						
					}
					
				} else {
					
					var $next = $selected.next();
					if ($next.length) {
						
						$selected.removeClass(sel);
						$selected = $next.addClass(sel);
						
					}
					
				}
				
			} else {
				
				$selected = $ul.find('li').eq(0).addClass(sel);
				
			}
			
		} else if (which === enterkey) {
			
			select();
			
		}
		
	}
	
	/**
	 * show the autocomplete suggestion box.
	 */
	function show() {
		var offset = $input.offset();
		$dd.css({
			top: offset.top + input.offsetHeight,
			left: offset.left,
			width: input.offsetWidth
		});
		$dd.show();
	}
	
	/**
	 * hide the autocomplete suggestions.
	 */
	function hide() {
		//$selected = null;
		$dd.hide();
	}
	
	$input
		
		// wire up modification handler
		.bind("change keyup", modified)
		
		// hide autocomplete suggestions when form is submitted
		.parent('form')
			.submit(select);
	
}

// set up input box for autocompletion
$('.search input').each(function(){
	autocomplete(this);
});

// exports
tenk.autocomplete = autocomplete;
tenk.suggest = suggest;

})(window,window['10kse'],jQuery);
