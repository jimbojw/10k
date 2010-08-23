## 10k personal search engine (10kse)

<div style="float:right">
![Welcome tab](http://github.com/jimbojw/10k/raw/master/screenshots/welcome.png)
</div>

[My submission](http://10k.aneventapart.com/Entry/251) for the [10k apart contest](http://10k.aneventapart.com/).

### developed by

Jim R. Wilson (jimbojw | [hexlib](http://twitter.com/hexlib))

### about

This is an application that I've wanted to write for a long time, but didn't for a variety of reasons - the most salient
of which being the difficulty of implementing such an app in a cross-browser fashion.

The 10k apart contest seemed like an excellent opportunity to sit down and actually put it together.

### development

The source tree looks something like this:

* src - source code separated out by type
* build - files used in building the compressed/crushed end result
* dist - output from the build
* test - unit testing n' such

IMPORTANT: Don't bother opening `src/index.html` via a `file://` URI.  Modern browsers are very picky about running code between zones, so the bookmarklet to add links will flat-out not work since it needs to `postMessage()` to a hidden iframe.  You'll have to run some kind of web server to serve up the content, even for development.

### building

To clean out your build:

    make clean

To build

    make
    
Building requires these dependencies:

* java - used to run rhino for jslint checks and other scripts plus google closure compiler and YUI compressor
* ImageMagick - specifically, the `convert` command - used to turn the [ppm](http://en.wikipedia.org/wiki/Netpbm_format#PPM_example) file into a png
* pngcrush - makes the data png file really tiny

### repository
* [http://github.com/jimbojw/10k/](http://github.com/jimbojw/10k/)

### license

10kse is released under [The MIT License](http://www.opensource.org/licenses/mit-license.php).

