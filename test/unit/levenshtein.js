/**
 * trie.js
 */
(function(tenk){

var
	
	trie = tenk.trie,
	levenshtein = tenk.levenshtein;

module("levenshtein");

test("levenshtein", function() {
	
	var
		
		// trie object for testing
		t = trie({
			h:{
				e:{
					y:{
						a:{
							$:1
						},
						$:1
					},
					l:{
						l:{
							o:{
								$:1
							}
						}
					}
				},
				i:{
					$:1
				}
			}
		}),
		
		// tests to run
		leventests = [
		
			// args, expected
			[ ['miss', 2], [] ],
			[ ['hi', 0], ['hi'] ],
			[ ['hi', 1], ['hi'] ],
			[ ['hi', 2], ['hey', 'hi'] ],
			[ ['hi', 3], ['hey', 'heya', 'hi'] ],
			[ ['key', 0], [] ],
			[ ['key', 1], ['hey'] ],
			[ ['key', 2], ['hey', 'heya'] ],
			[ ['jello', 1], ['hello'] ],
			[ ['jelly', 1], [] ],
			[ ['jelly', 2], ['hello'] ],
			[ ['is', 2], ['hi'] ],
			[ ['I', 1], ['hi'] ],
			[ ['eye', 2], ['hey', 'heya'] ]
		
		],
		len = leventests.length,
		
		// iteration vars
		i,
		leventest,
		args,
		expected;
	
	expect(len + 1);
	
	ok(levenshtein, "basic availability");
	
	for (i=0; i<len; i++) {
		
		leventest = leventests[i];
		args = leventest[0];
		expected = leventest[1];
		
		QUnit.deepEqual(
			levenshtein.apply(t, args),
			expected,
			'(' + args.join(', ') + ')'
		);
		
	}
	
});


})(window['10kse']);

