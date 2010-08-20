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
	$saved = $prefs.find('.saved'),
	
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
	
	$saved.css({
		visibility: '',
		opacity: 1
	});
	
	setTimeout(function(){
		$saved.animate({
			opacity: 0
		}, 'slow');
	}, 1000);
	
});

})(window['10kse'],jQuery);
