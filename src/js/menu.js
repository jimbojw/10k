/**
 * menu.js - implement menu navigation.
 */
(function(tenk,$,undefined) {

var
	
	// storage api
	get = tenk.get,
	set = tenk.set,
	
	// common string - helps compressibility
	activeClass = 'selected',
	
	// show only the active pane and matching tab
	$active;

/**
 * shows a tab given its name.
 * @param {string} name The name of the tab to show.
 */
function showtab(name) {
	
	var $selected = $('.pane.' + name + ', nav .' + name);
	
	if (!$selected.length) {
		throw "no such tab named '" + name + "'";
	}
	
	if ($active) {
		$active.removeClass(activeClass);
	}
	
	$active = $selected.addClass(activeClass);
	
	set("TAB", name);
	
}

// initialize active tab
showtab(get("TAB") || 'welcome');

/**
 * handler for tab clicking
 */
function tabclick(e){
	
	var $li = $(this);
	
	if (!$li.hasClass('active')) {
		showtab(this.className);
	}
	
}

// listen for tab clicks
$('nav li').click(tabclick);

// setup and content bound navigation links
$('a.nav').click(function(e){
	e.preventDefault();
	var
		url = this.href,
		tab = url.substr(url.lastIndexOf('#') + 1);
	showtab(tab);
});

// exports
tenk.showtab = showtab;

})(window['10kse'],jQuery);
