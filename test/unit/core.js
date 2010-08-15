/**
 * core.js
 */
(function(tenk){

module("intro");

test("10kse namespace", function() {
	expect(1);
	ok(tenk, "window['10kse']");
});

})(window['10kse']);

