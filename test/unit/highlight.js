/**
 * highlight.js
 */
(function(tenk){

var highlight = tenk.highlight;

module("highlight");

test("function availability", function() {
	
	expect(1);
	
	ok(highlight, "highlight");
	
});

test("simple tests", function() {
	
	expect(7);
	
	equals(
		highlight("hello world", []),
		"hello world",
		"highlighting nothing in 'hello world'");
	
	equals(
		highlight("hello world", ["hello"]),
		"<b>hello</b> world",
		"highlighting 'hello' in 'hello world'");
	
	equals(
		highlight("hello world", ["world"]),
		"hello <b>world</b>",
		"highlighting 'world' in 'hello world'");
	
	equals(
		highlight("hello world", ["hello", "world"]),
		"<b>hello</b> <b>world</b>",
		"highlighting 'hello' and 'world' in 'hello world'");
	
	equals(
		highlight("hello world", ["apple"]),
		"hello world",
		"highlighting 'apple' in 'hello world'");
	
	equals(
		highlight("hello world", ["hello", "apple"]),
		"<b>hello</b> world",
		"highlighting 'hello' and 'apple' in 'hello world'");
	
	equals(
		highlight("hello world", ["hello", "apple", "world"]),
		"<b>hello</b> <b>world</b>",
		"highlighting 'hello', 'apple' and 'world' in 'hello world'");
	
});

test("case differences", function() {
	
	expect(3);
	
	equals(
		highlight("hello world", ["HELLO"]),
		"<b>hello</b> world",
		"highlighting 'HELLO' in 'hello world'");
	
	equals(
		highlight("HELLO WORLD", ["world"]),
		"HELLO <b>WORLD</b>",
		"highlighting 'world' in 'HELLO WORLD'");
	
	equals(
		highlight("HeLLo wOrLd", ["hEllO", "WoRlD"]),
		"<b>HeLLo</b> <b>wOrLd</b>",
		"highlighting 'hEllO' and 'WoRlD' in 'HeLLo wOrLd'");
	
});

test("sentence highlighting", function() {
	
	expect(3);
	
	equals(
		highlight(
			"The quick brown fox jumped over the lazy dog.",
			["brown"]
		),
		"The quick <b>brown</b> fox jumped over the lazy dog.",
		"hilighting 'brown'");
	
	equals(
		highlight(
			"The quick brown fox jumped over the lazy dog.",
			["over", "brown"]
		),
		"The quick <b>brown</b> fox jumped <b>over</b> the lazy dog.",
		"highlighting 'over', 'brown'");
	
	equals(
		highlight(
			"The quick brown fox jumped over the lazy dog.",
			["fox", "jumped"]
		),
		"The quick brown <b>fox</b> <b>jumped</b> over the lazy dog.",
		"highlighting 'over', 'brown'");
	
});

test("truncation", function() {
	
	expect(1);
	
	equals(
		highlight(
			" 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789" +
			" 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789" +
			" 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789 123456789",
			[]
		),
		" 123456789 123456789 123456789 123456789 12345 ...",
		"basic truncation");
	
});

test("real-life examples", function() {
	
	expect(2);
	
	equals(
		highlight(
			"ZSI: The Zolera Soap Infrastructure",
			["zolera", "soap"]
		),
		"ZSI: The <b>Zolera</b> <b>Soap</b> Infrastructure",
		"highlighting 'zolera' and 'soap' in the page title");
	
	equals(
		highlight(
			"boto - Project Hosting on Google Code",
			["hosting", "project"]
		),
		"boto - <b>Project</b> <b>Hosting</b> on Google Code",
		"highlighting 'project' and 'hosting' in the page title");
	
});

})(window['10kse']);

