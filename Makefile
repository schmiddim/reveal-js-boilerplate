SHELL := /usr/bin/env bash
PORT ?= 8000
URL  := http://localhost:$(PORT)

.DEFAULT_GOAL := help
.PHONY: help install serve

help:
	@echo ""
	@echo "Usage:"
	@echo "  make install   Install reveal.js via npm"
	@echo "  make serve     Start local HTTP server and open browser"
	@echo ""

install:
	@echo "▶ Checking requirements"
	@command -v node >/dev/null 2>&1 || { echo "❌ node not found"; exit 1; }
	@command -v npm  >/dev/null 2>&1 || { echo "❌ npm not found";  exit 1; }

	@if [ ! -d node_modules/reveal.js ]; then \
		echo "▶ Installing reveal.js"; \
		npm init -y >/dev/null 2>&1 || true; \
		npm install reveal.js; \
	else \
		echo "✅ reveal.js already installed"; \
	fi

serve: install
	@echo "▶ Starting local server on $(URL)"
	@command -v xdg-open >/dev/null 2>&1 || { echo "❌ xdg-open not found"; exit 1; }
	@(sleep 1; xdg-open "$(URL)" >/dev/null 2>&1 || true) & \
	npx serve . -l $(PORT)
