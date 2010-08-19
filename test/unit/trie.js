/**
 * trie.js
 */
(function(tenk){

var trie = tenk.trie;

module("trie");

test("basic availability", function() {
	
	expect(1);
	
	ok(trie, "trie");
	
});

test("simple insertion", function() {
	
	expect(1);
	
	var
		data = {},
		t = trie(data);
	
	t.add("abc");
	
	QUnit.deepEqual(data, {a:{b:{c:{$:1}}}}, "added 'abc'");
	
});

test("multiple insertion", function() {
	
	expect(3);
	
	var
		data = {},
		t = trie(data);
	
	t.add("hello");
	
	QUnit.deepEqual(
		data,
		{
			h:{
				e:{
					l:{
						l:{
							o:{
								$:1
							}
						}
					}
				}
			}
		},
		"added 'hello'"
	);
	
	t.add("hi");
	
	QUnit.deepEqual(
		data,
		{
			h:{
				i:{
					$:1
				},
				e:{
					l:{
						l:{
							o:{
								$:1
							}
						}
					}
				}
			}
		},
		"added 'hi'"
	);
	
	
	t.add("hey");
	
	QUnit.deepEqual(
		data,
		{
			h:{
				i:{
					$:1
				},
				e:{
					y:{
						$:1
					},
					l:{
						l:{
							o:{
								$:1
							}
						}
					}
				}
			}
		},
		"added 'hey'"
	);
	
});

test("find node", function() {
	
	expect(2);
	
	var
		data = {
			h:{
				i:{
					$:1
				},
				e:{
					y:{
						$:1
					},
					l:{
						l:{
							o:{
								$:1
							}
						}
					}
				}
			}
		},
		t = trie(data);
	
	QUnit.deepEqual(
		t.find("he"),
		{
			y:{
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
		"find('he')"
	);
	
	equals(t.find("miss"), null, "find('miss')");
	
});

test("find matches", function() {
	
	expect(5);
	
	var
		data = {
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
		},
		t = trie(data);
	
	QUnit.deepEqual(t.match("miss"), [], "match 'miss'");
	
	QUnit.deepEqual(t.match("h"), ['hello', 'hey', 'heya', 'hi'], "match 'h'");
	
	QUnit.deepEqual(t.match("he"), ['hello', 'hey', 'heya'], "match 'he'");
	
	QUnit.deepEqual(t.match("hey"), ['hey', 'heya'], "match 'hey'");
	
	QUnit.deepEqual(t.match("heya"), ['heya'], "match 'heya'");
	
});


})(window['10kse']);

