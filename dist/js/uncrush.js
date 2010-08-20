/**
 * uncrush.js - uncrushes and extcracts payload from data.png.
 */
(function($){

var
	
	// an image to load the data file
	img = new Image(),
	
	// canvas and context to draw the file and extract pixel data
	canvas = $("<canvas />").get(0),
	ctx = canvas.getContext('2d');

img.onload = function(){
	
	var
		// collect image info
		w = img.width,
		h = img.height;
	
	// resize canvas
	canvas.width = w;
	canvas.height = h;
	
	// draw image to canvas
	ctx.drawImage(img,0,0);
	
	var
		
		// extract image data
		imgd = ctx.getImageData(0,0,w,h),
		pix = imgd.data,
		
		// prepare to extract byte data
		buf = [],
		pos = 0,
		i = 0,
		n = pix.length;
	
	// pull out color data as character codes
	while (i < pix.length) {
		buf[pos++] = pix[i++]; // red
		buf[pos++] = pix[i++]; // green
		buf[pos++] = pix[i++]; // blue
		i++; // alpha (ignore)
	}
	
	// find ending position of data content
	pos = buf.length - 1;
	while (buf[pos] === 255) {
		pos--;
	}
	
	var
		
		// convert char code array to string
		content = String.fromCharCode.apply(null, buf.slice(0,pos)),
		
		// determine boundaries of css, html and js content
		bound = content.indexOf(']') + 1,
		sizes = JSON.parse(content.substr(0, bound)),
		
		// pull out content types
		css = content.substr(bound, sizes[0]),
		html = content.substr(bound + sizes[0], sizes[1]),
		js = content.substr(bound + sizes[0] + sizes[1]);
	
	// inject css
	$('<style type="text/css">' + css + '</style>').appendTo('head');
	
	// inject html
	$('body').html(html);
	
	// execute javascript
	(new Function(js))();
};

img.src = 'data.png';

})(jQuery);
