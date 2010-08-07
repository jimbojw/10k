SRC_DIR = src
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

DATE = `git log -1 | grep Date: | sed 's/[^:]*: *//'`

JS_FILES = \
	${SRC_DIR}/js/bookmarklet.js\
	${SRC_DIR}/js/search.js

JS_OUT = ${DIST_DIR}/js/script.js
JS_MIN = ${DIST_DIR}/js/script.min.js

CSS_FILES = \
	${SRC_DIR}/css/style.css

CSS_OUT = ${DIST_DIR}/css/style.css
CSS_MIN = ${DIST_DIR}/css/style.min.css

INDEX_FILE = ${SRC_DIR}/index.html
INDEX_OUT = ${DIST_DIR}/index.html

RHINO = java -jar ${BUILD_DIR}/js.jar
MINJAR = java -jar ${BUILD_DIR}/google-compiler-20100514.jar
YUIJAR = java -jar ${BUILD_DIR}/yuicompressor-2.4.2.jar

all: jsbuild cssbuild htmlbuild
	@@echo "10k build complete."

jsbuild: jscat jslint jsmin
	@@echo "javascript build complete."

cssbuild: csscat cssmin
	@@echo "css build complete."

htmlbuild: htmlreplace
	@@echo "html build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}
	@@mkdir -p ${DIST_DIR}/js
	@@mkdir -p ${DIST_DIR}/css

init:
	@@echo "Grabbing external dependencies..."
	@@if test ! -d test/qunit/.git; then git clone git://github.com/jquery/qunit.git test/qunit; fi
	- @@cd test/qunit && git pull origin master > /dev/null 2>&1

jscat: ${DIST_DIR} ${JS_OUT}

${JS_OUT}: init ${JS_FILES}
	@@echo "Building" ${JS_OUT}
	@@cat ${JS_FILES} > ${JS_OUT};

jslint: ${JS_OUT}
	@@echo "Checking javascript against JSLint..."
	@@${RHINO} build/jslint-check.js

jsmin: ${JS_MIN}

${JS_MIN}: ${JS_OUT}
	@@echo "Building" ${JS_MIN}
	@@${MINJAR} --js ${JS_OUT} --warning_level QUIET > ${JS_MIN}

csscat: ${DIST_DIR} ${CSS_OUT}

${CSS_OUT}: init ${CSS_FILES}
	@@echo "Building" ${CSS_OUT}
	@@cat ${CSS_FILES} > ${CSS_OUT};

cssmin: ${CSS_MIN}

${CSS_MIN}: ${CSS_OUT}
	@@echo "Building" ${CSS_MIN}
	@@${YUIJAR} --type css ${CSS_OUT} > ${CSS_MIN}

htmlreplace: ${DIST_DIR} ${INDEX_OUT}

${INDEX_OUT}: init ${INDEX_FILE}
	@@echo "Building" ${INDEX_OUT}
	@@cat ${INDEX_FILE} | \
		${RHINO} build/replace.js \
			style ${CSS_MIN} \
			script ${JS_MIN} >\
		${INDEX_OUT}
	@@echo "Total size:" `du -bh ${INDEX_OUT} | sed -e 's/\s.*//'`

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

	@@echo "Removing cloned directories"
	@@rm -rf test/qunit

