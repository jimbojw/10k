/**
 * data-to-pgm.js - encodes standard input (ascii) as a PGM P2 grayscale image.
 */
(function(){

var
	
	// setup the input buffer and output buffer
	stdin = new java.io.BufferedReader(new java.io.InputStreamReader(java.lang.System['in'])),
	
	// prepare line buffer
	lines = [],
	count = 0,
	buf;

// read stdin buffer until EOF (or skip)
while (stdin.ready()) {
	lines[count++] = stdin.readLine();
}
buf = lines.join("\n");

// determine image size
var
	len = buf.length,
	px = Math.ceil(len / 3),
	w = Math.ceil(Math.sqrt(px)),
	h = Math.ceil(px / w);

// headers
print("P3");
print("# data as pgm");
print(w + " " + h);
print(255);

// data
var pos = 0;
for (var j=0 ; j<h; j++) {
	var row = [];
	for (var i=0; i<w; i++) {
		var
			red = buf.charCodeAt(pos++),
			blue = buf.charCodeAt(pos++),
			green = buf.charCodeAt(pos++);
		red = (isNaN(red) ? 255 : red);
		blue = (isNaN(blue) ? 255 : blue);
		green = (isNaN(green) ? 255 : green);
		row[i] = [red, blue, green].join(" ");
	}
	print(row.join(" "));
}

}).apply(this, arguments);

