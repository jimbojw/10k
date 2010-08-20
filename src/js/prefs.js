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
	$csscode = $prefs.find('.csscode'),
	$jscode = $prefs.find('.jscode'),
	
	// prefered web search
	s = get("S") || '',
	
	// custom code
	css = get("CSS") || null,
	js = get("JS") || null;

if (!s) {
	s = $prefs.find('.def').attr('href');
	set("S", s);
}
$input.val(s);

if (css === null) {
	css = '/* your custom css here */';
	set("CSS", css);
}
$csscode.val(css);

if (js === null) {
	js = '/* your custom js here */';
	set("JS", js);
}
$jscode.val(js);

$prefs.find('li a').click(function(e){
	
	e.preventDefault();
	
	$input.val(this.href);
	
});

$prefs.find('form').submit(function(e){
	
	e.preventDefault();
	
	set("S", $input.val());
	set("CSS", $csscode.val());
	set("JS", $jscode.val());
	
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

// add custom css
$('<style type="text/css">' + css + '</style>').appendTo('head');

// add custom js
$(new Function(js));

})(window['10kse'],jQuery);
