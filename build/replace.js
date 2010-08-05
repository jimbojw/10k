/**
 * replace.js
 */
(function(){

// short-circuit if too few arguments were sent
if (arguments.length < 2) {
	throw "Too few command line arguments: 2 expected, " + arguments.length + " received.";
}

/**
 * perform replacement on input
 */
function performReplacement(input, tag, file) {
	
	// read in the file contents of the specified file
	var content = readFile(file);
	
	// perform tag replacement
	var find = new RegExp("<!--" + tag + "(\\s+.*?)?-->[\\s\\S]*?<!--/" + tag + "-->", 'gm');
	return input.replace(find, "<" + tag + "$1>" + content + "</" + tag + ">");
	
}

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

// perform replacement for all pairs of arguments
for (var i=1, l=arguments.length; i<l; i+=2) {
	buf = performReplacement(buf, arguments[i-1], arguments[i]);
}

// output modified buffer
print(buf);

}).apply(this, arguments);


