My submission for the 10k apart contest.

## local storage

Mappings:

* url to id/title/text
* id to url
* word to tuples containing id/type/position pairs

	word: {
		id: {
			type: [
				pos, pos, pos
			]
		}
	}

Types (in order of importance):

* "s" - selection
* "t" - title
* "p" - prioritized tags
* "c" - full text content

