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
	w = px * 3;

// headers
print("P3");
print("# data as pgm");
print(px + " " + 1);
print(255);

// data
var pos = 0;
while (pos < len) {
	print(buf.charCodeAt(pos++));
}
switch (pos % 3) {
	case 1: print(255);
	case 2: print(255);
}

}).apply(this, arguments);

