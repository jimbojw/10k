/**
 * extract.js
 */
(function(tag){

// short-circuit if too few arguments were sent
if (!tag) {
	throw "Too few command line arguments: 1 expected.";
}

var
	
	// setup the input buffer and output buffer
	stdin = new java.io.BufferedReader(
		new java.io.InputStreamReader(
			java.lang.System['in']
		)
	),
	
	// prepare line buffer
	lines = [],
	count = 0,
	input;

// read stdin buffer until EOF (or skip)
while (stdin.ready()) {
	lines[count++] = stdin.readLine();
}
input = lines.join("\n");

// look for tag pair
var
	find = new RegExp("<!--" + tag + "(?:\\s+.*?)?-->([\\s\\S]*?)<!--/" + tag + "-->", 'm'),
	m = input.match(find);

if (m) {
	print(m[1].replace(/^\s+|\s+$/g, ''));
} else {
	throw "No match found for psuedo tag pair: " + tag;
}

}).apply(this, arguments);


