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
		
		// image info
		width = img.width,
		
		// iteration vars for chunked draw/read
		offset = 0,
		chunk = 8192,
		imgw;
	
	// resize canvas
	canvas.width = chunk;
	canvas.height = 1;
	
	var
		
		// prepare to extract byte data
		buf = [],
		pos = 0;
	
	while (offset < width) {
		
		// draw image to canvas
		ctx.drawImage(img, -offset, 0);
		
		// calculate img width
		if (width > offset + chunk) {
			imgw = chunk;
		} else {
			imgw = width - offset;
		}
		
		var
			
			// extract image data
			imgd = ctx.getImageData(0, 0, imgw, 1),
			pix = imgd.data,
			n = pix.length,
			i = 0;
		
		// pull out color data as character codes
		while (i < pix.length) {
			buf[pos++] = pix[i++]; // red
			buf[pos++] = pix[i++]; // green
			buf[pos++] = pix[i++]; // blue
			i++; // alpha (ignore)
		}
		
		offset += chunk;
		
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

img.src = '/dist/final/data.png';

})(jQuery);
