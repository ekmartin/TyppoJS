BIN = node_modules/.bin
BROWSERIFY = $(BIN)/browserify
JS = $(shell find app/client -name '*.js')

DIST=public

all: $(DIST)/game.js

$(DIST)/game.js: $(JS)
	$(BROWSERIFY) app/client/main.js -o $(DIST)/game.js -d

install:
	npm install
	bower install

server:
	node_modules/.bin/supervisor index.js

clean:
	rm $(DIST)/game.js

.PHONY: all install server clean
