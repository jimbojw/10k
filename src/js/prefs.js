/**
 * prefs.js - implements the prefs tab.
 */
(function(tenk,$){

var
	
	// storage api
	get = tenk.get,
	set = tenk.set,
	
	// cached jquery results
	$prefs = $('.prefs.pane'),
	$input = $prefs.find('input').eq(0),
	
	// prefered web search
	s = get("S") || '';

if (!s) {
	s = $prefs.find('.def').attr('href');
	set("S", s);
}
$input.val(s);

$prefs.find('li a').click(function(e){
	
	e.preventDefault();
	
	$input.val(this.href);
	
});

$prefs.find('form').submit(function(e){
	
	e.preventDefault();
	
	s = $input.val();
	set("S", s);
	
	alert('Preferences saved successfully!')
	
});

})(window['10kse'],jQuery);
