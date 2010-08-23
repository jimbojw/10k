## 10k personal search engine (10kse)

A personal search engine in 10k.

### developed by:

* Jim R. Wilson (jimbojw | hexlib)
* twitter: @hexlib
* email: wilson.jim.r@gmail.com

### about

This is an application that I've wanted to write for a long time, but didn't for
a variety of reasons - the most salient of which being the difficulty of 
implementing such an app in a cross-browser fashion.

The 10k apart contest seemed like an excellent opportunity to sit down and 
actually put it together.

### development

All the source is available on github here:

http://github.com/jimbojw/10k/

A description of the source tree, including instructions on how to build it can 
be found there.

The code is available under the MIT license.

### libraries

I have chosen to use jQuery and typekit for this project.

The only external API I used was the Google charts api to generate the QR Code
on the Contact tab.  I feel this is within the purview of the rules, considering
the extensive use of other Google API's (such as maps) other entries have made.

### browser support

I have tested this in:

* Firefox 3.6 on ubuntu
* Cromium nightly on ubuntu (~Chrome 6)
* IE 8 (with the app in uncompressed source form)
* IE 9 preview 4

Any IE 9 preview is not really a browser: it lacks key browser features such as 
an address bar, forward and back buttons, tabs, etc.

The most important feature to my app that IE 9 previews lack is bookmarks /
favorites support.  In order to add pages to the index, my app requires running
JavaScript code in the context of the page being indexed.  Without bookmarks or
an address bar, this can only be achieved via developer tools.

To that end, I have tested the bookmarklet functionality by entering the code
in the developer console, and this works.  I've also confirmed that it works in
IE 8, minus extreme compression (that is, using the canvas to read out data 
bytes from a crushed png file).

In any case, I feel fairly confident that it'll work in IE 9 with favorites 
support, but I have absolutely no way to test this.

### thanks

I'll be happy to answer any questions.

Thanks in advance for your consideration!

