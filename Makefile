install:
	npm install
	bower install

server:
	node_modules/.bin/supervisor index.js

.PHONY: install server
