/**
 * autocomplete.js - stripped-down implementation of autocomplete.
 */
(function(window,tenk,$,undefined){

var
	
	// key codes
	space = 32,
	upkey = 38,
	rightkey = 39,
	downkey = 40,
	enterkey = 13,
	esckey = 27,
	
	// short-hand for common strings (aids compressibity)
	selectedClass = 'selected',
	
	// suggest completions for string
	suggest = tenk.suggest;


/**
 * given a target element, finds nearest 'li' parent, or self if it's already an 'li'
 * @param {element} target A DOM element.
 * @return {mixed} Either a jQuery result object, or null if there was no match.
 */
function targetli(target) {
	
	var
		$target = $(target),
		$li = $target.is('li') ? $target : $target.parent('li');
	
	return $li.length ? $li : null;
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
		$selected = null,
		
		// have the arrow keys been pressed since the last select()?
		arrowspressed;
	
	/**
	 * action to take when the user selects an option.
	 */
	function select() {
		
		if ($selected) {
			
			var
				word = $selected.text(),
				value = $input.val(),
				pos = value.lastIndexOf(' ') + 1;
			
			$input.val(previous = value.substr(0, pos) + word);
			
			$selected.removeClass(selectedClass);
			$selected = null;
			
			arrowspressed = null;
			
			tenk.search();
			
		}
		
		hide();
		
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
			which = e.which;
		
		if (which === enterkey || which === rightkey) {
			
			select();
			
		} else if (which === space && $selected && arrowspressed) {
			
			$input.val($input.val().replace(/\s+$/,''));
			select();
			$input.val($input.val() + ' ');
			
		} else if (which === esckey) {
			
			hide();
			
		} else if (which === upkey || which === downkey) {
			
			arrowspressed = true;
			
			if ($selected) {
				
				if (which === upkey) {
					
					var $prev = $selected.prev();
					if ($prev.length) {
						
						$selected.removeClass(selectedClass);
						$selected = $prev.addClass(selectedClass);
						
					}
					
				} else {
					
					var $next = $selected.next();
					if ($next.length) {
						
						$selected.removeClass(selectedClass);
						$selected = $next.addClass(selectedClass);
						
					}
					
				}
				
			} else {
				
				$selected = $ul.find('li').eq(0).addClass(selectedClass);
				
			}
			
			show();
			
		} else if (value !== previous) {
			
			previous = value;
			
			var
				
				// extract last word of input
				pos = value.lastIndexOf(' '),
				word = value.substr(pos < 0 ? 0 : pos).toLowerCase();
			
			if (word.length) {
				
				// get suggestions and update choices
				var suggestions = suggest(word);
				if (suggestions && suggestions.length) {
					update(suggestions, word);
				} else {
					hide();
				}
				
			} else {
				
				hide();
				
			}
			
		}
	}
	
	/**
	 * show the autocomplete suggestion box.
	 */
	function show() {
		if ($ul.find('li').length) {
			var offset = $input.offset();
			$dd.css({
				top: offset.top + input.offsetHeight,
				left: offset.left,
				width: input.offsetWidth
			});
			$dd.show();
		}
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
	
	/**
	 * handler for mousing over autocomplete drop-down.
	 */
	function mouseover(e) {
		
		var $li = targetli(e.target);
		
		if ($li) {
			
			// user is using mouse, clear arrowspressed flag
			arrowspressed = null;
			
			if ($selected) {
				
				if ($selected.get(0) !== $li.get(0)) {
					
					$selected.removeClass(selectedClass);
					
				}
				
			}
			
			$selected = $li.addClass(selectedClass);
			
		}
		
	}
	
	// wire up list for mouse interaction
	$ul
		.mouseover(mouseover)
		.click(select);
	
	// clear the autocompleter when clicking anywhere else
	$('body').click(hide);
	
}

// set up input box for autocompletion
$('.search input').eq(0).each(function(){
	autocomplete(this);
});

// exports
tenk.autocomplete = autocomplete;

})(window,window['10kse'],jQuery);
