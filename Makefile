SHELL := /usr/bin/env bash
PORT ?= 8000
URL  := http://localhost:$(PORT)

.DEFAULT_GOAL := help
.PHONY: help install serve

help:
	@echo ""
	@echo "Usage:"
	@echo "  make install   Install dependencies and build bundle"
	@echo "  make serve     Start local HTTP server and open browser"
	@echo ""

install:
	@echo "▶ Checking requirements"
	@command -v node >/dev/null 2>&1 || { echo "❌ node not found"; exit 1; }
	@command -v npm  >/dev/null 2>&1 || { echo "❌ npm not found";  exit 1; }

	@echo "▶ Installing npm dependencies"
	@npm install
	@echo "▶ Building bundle"
	@npm run build

serve: install
	@echo "▶ Starting dev server with hot reload on $(URL)"
	@command -v xdg-open >/dev/null 2>&1 || { echo "❌ xdg-open not found"; exit 1; }
	@PORT=$(PORT) npm run serve
