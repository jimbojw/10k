/**
 * makeppm.js - encodes any number of text files into a PPM (P3) image.
 */
(function(){

// short-circuit if too few arguments were sent
if (arguments.length < 1) {
	throw "Too few command line arguments: 1 or more expected.";
}

// grab file contents
var
	contents = [],
	sizes = [];
for (var i=0, l=arguments.length; i<l; i++) {
	var content = readFile(arguments[i]);
	contents[i] = content;
	sizes[i] = content.length;
}

// create buffer containing size and file information
var buf = '[' + sizes + ']' + contents.join('');

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

