SHELL := /usr/bin/env bash
PORT ?= 8000
URL  := http://localhost:$(PORT)

.DEFAULT_GOAL := help
.PHONY: help install serve pdf

help:
	@echo ""
	@echo "Usage:"
	@echo "  make install   Install dependencies and build bundle"
	@echo "  make serve     Start local HTTP server and open browser"
	@echo "  make pdf       Generate slides.pdf from presentation"
	@echo ""

install:
	@npm install
	@npm run build

serve: install
	@PORT=$(PORT) npm run serve

pdf: install
	@PORT=$(PORT) npm run serve > /dev/null 2>&1 &
	@SERVER_PID=$$!; \
	sleep 6; \
	npx decktape --pause 500 generic $(URL)/index.html slides.pdf; \
	kill $$SERVER_PID 2>/dev/null || true; \
	echo "✓ PDF generated: slides.pdf"
