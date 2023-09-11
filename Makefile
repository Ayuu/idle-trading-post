.DEFAULT_GOAL := prod

.PHONY: prod
prod:
	webpack-cli --mode production
	npm run zip

.PHONY: dev
dev:
	webpack-cli --mode development --watch

.PHONY: clean
clean:
	rm -rf dist.zip