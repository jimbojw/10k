SRC_DIR = src
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

DATE = `git log -1 | grep Date: | sed 's/[^:]*: *//'`

JS_FILES = \
	${SRC_DIR}/js/intro.js\
	${SRC_DIR}/js/menu.js\
	${SRC_DIR}/js/prefs.js\
	${SRC_DIR}/js/trie.js\
	${SRC_DIR}/js/levenshtein.js\
	${SRC_DIR}/js/scanner.js\
	${SRC_DIR}/js/indexer.js\
	${SRC_DIR}/js/bookmarklet.js\
	${SRC_DIR}/js/showall.js\
	${SRC_DIR}/js/ranking.js\
	${SRC_DIR}/js/highlight.js\
	${SRC_DIR}/js/suggest.js\
	${SRC_DIR}/js/autocomplete.js\
	${SRC_DIR}/js/search.js

JS_OUT = ${DIST_DIR}/js/script.js
JS_MIN = ${DIST_DIR}/js/script.min.js

JS_CRUSH_FILES = \
	${SRC_DIR}/js/uncrush.js

JS_CRUSH_OUT = ${DIST_DIR}/js/uncrush.js
JS_CRUSH_MIN = ${DIST_DIR}/js/uncrush.min.js

CSS_FILES = \
	${SRC_DIR}/css/style.css\
	${SRC_DIR}/css/menu.css\
	${SRC_DIR}/css/autocomplete.css

CSS_OUT = ${DIST_DIR}/css/style.css
CSS_MIN = ${DIST_DIR}/css/style.min.css

HTML_CONTENT = ${DIST_DIR}/content.html

IMAGE_PPM = ${DIST_DIR}/image/raw.ppm
IMAGE_PNG = ${DIST_DIR}/image/uncrushed.png
DATA_PNG = ${DIST_DIR}/final/data.png

INDEX_FILE = ${SRC_DIR}/index.html
INDEX_OUT = ${DIST_DIR}/compressed/index.html

ICON_FILE = ${SRC_DIR}/image/icon.png
ICON_OUT = ${DIST_DIR}/final/icon.png

FINAL_OUT = ${DIST_DIR}/final/out.tmp

CRUSH_FILE = ${SRC_DIR}/crush.html
CRUSH_OUT = ${DIST_DIR}/final/index.html

RHINO = java -jar ${BUILD_DIR}/js.jar
MINJAR = java -jar ${BUILD_DIR}/google-compiler-20100514.jar
YUIJAR = java -jar ${BUILD_DIR}/yuicompressor-2.4.2.jar

all: jsbuild cssbuild imagebuild iconbuild htmlbuild finalsize
	@@echo "10k build complete."

jsbuild: jscat jslint jsmin jscrushcat jscrushlint jscrushmin
	@@echo "javascript build complete."

cssbuild: csscat cssmin
	@@echo "css build complete."

imagebuild: htmlcontent ppmbuild pngconvert pngcrush
	@@echo "image build complete."

iconbuild: iconcrush
	@@echo "icon build complete."

htmlbuild: htmlreplace crushreplace
	@@echo "html build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}
	@@mkdir -p ${DIST_DIR}/js
	@@mkdir -p ${DIST_DIR}/css
	@@mkdir -p ${DIST_DIR}/image
	@@mkdir -p ${DIST_DIR}/html
	@@mkdir -p ${DIST_DIR}/compressed
	@@mkdir -p ${DIST_DIR}/final

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
	@@${RHINO} build/jslint-check.js ${JS_OUT}

jsmin: ${JS_MIN}

${JS_MIN}: ${JS_OUT}
	@@echo "Building" ${JS_MIN}
	@@${MINJAR} --js ${JS_OUT} --warning_level QUIET > ${JS_MIN}

jscrushcat: ${DIST_DIR} ${JS_CRUSH_OUT}

${JS_CRUSH_OUT}: init ${JS_CRUSH_FILES}
	@@echo "Building" ${JS_CRUSH_OUT}
	@@cat ${JS_CRUSH_FILES} > ${JS_CRUSH_OUT};

jscrushlint: ${JS_CRUSH_OUT}
	@@echo "Checking javascript against JSLint..."
	@@${RHINO} build/jslint-check.js ${JS_CRUSH_OUT}

jscrushmin: ${JS_CRUSH_MIN}

${JS_CRUSH_MIN}: ${JS_CRUSH_OUT}
	@@echo "Building" ${JS_CRUSH_MIN}
	@@${MINJAR} --js ${JS_CRUSH_OUT} --warning_level QUIET > ${JS_CRUSH_MIN}

csscat: ${DIST_DIR} ${CSS_OUT}

${CSS_OUT}: init ${CSS_FILES}
	@@echo "Building" ${CSS_OUT}
	@@cat ${CSS_FILES} > ${CSS_OUT};

cssmin: ${CSS_MIN}

${CSS_MIN}: ${CSS_OUT}
	@@echo "Building" ${CSS_MIN}
	@@${YUIJAR} --type css ${CSS_OUT} > ${CSS_MIN}

htmlcontent: ${DIST_DIR} ${HTML_CONTENT}

${HTML_CONTENT}: init ${INDEX_FILE}
	@@echo "Building" ${HTML_CONTENT}
	@@cat ${INDEX_FILE} | ${RHINO} build/extract.js html > ${HTML_CONTENT}

ppmbuild: ${DIST_DIR} ${IMAGE_PPM}

${IMAGE_PPM}: ${HTML_CONTENT}
	@@echo "Building" ${IMAGE_PPM}
	@@cat ${INDEX_FILE} | \
		${RHINO} build/makeppm.js \
			${CSS_MIN} \
			${HTML_CONTENT} \
			${JS_MIN} >\
		${IMAGE_PPM}

pngconvert: ${IMAGE_PNG}

${IMAGE_PNG}: ${IMAGE_PPM}
	@@echo "Building" ${IMAGE_PNG}
	@@convert ${IMAGE_PPM} ${IMAGE_PNG}

pngcrush: ${DATA_PNG}

${DATA_PNG}: ${IMAGE_PNG}
	@@echo "Building" ${DATA_PNG}
	@@pngcrush -q ${IMAGE_PNG} ${DATA_PNG}
	@@echo "Crushed png size:" `du -b ${DATA_PNG} | sed -e 's/\s.*//'`

iconcrush: ${DIST_DIR} ${ICON_OUT}

${ICON_OUT}: init ${ICON_FILE}
	@@echo "Building" ${ICON_OUT}
	@@pngcrush -q ${ICON_FILE} ${ICON_OUT}
	@@echo "Icon size:" `du -b ${ICON_OUT} | sed -e 's/\s.*//'`

htmlreplace: ${DIST_DIR} ${INDEX_OUT}

${INDEX_OUT}: init ${INDEX_FILE}
	@@echo "Building" ${INDEX_OUT}
	@@cat ${INDEX_FILE} | \
		${RHINO} build/replace.js \
			style ${CSS_MIN} \
			script ${JS_MIN} >\
		${INDEX_OUT}
	@@echo "Compressed index size:" `du -b ${INDEX_OUT} | sed -e 's/\s.*//'`

crushreplace: ${DIST_DIR} ${CRUSH_OUT}

${CRUSH_OUT}: init ${CRUSH_FILE}
	@@echo "Building" ${CRUSH_OUT}
	@@cat ${CRUSH_FILE} | \
		${RHINO} build/replace.js \
			script ${JS_CRUSH_MIN} >\
		${CRUSH_OUT}
	@@echo "Final index size:" `du -b ${CRUSH_OUT} | sed -e 's/\s.*//'`

finalsize: ${DIST_DIR} ${FINAL_OUT}

${FINAL_OUT}: init
	@@echo "Building" ${FINAL_OUT}
	@@cat ${CRUSH_OUT} ${DATA_PNG} ${ICON_OUT} > ${FINAL_OUT}
	@@echo "Total size:" `du -b ${FINAL_OUT} | sed -e 's/\s.*//'`
	@@rm -f ${FINAL_OUT}

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

	@@echo "Removing cloned directories"
	@@rm -rf test/qunit

