#!/usr/bin/env bash
set -e

PORT=8000

cleanup() {
  kill "$SERVER_PID" 2>/dev/null || true
}
trap cleanup EXIT

if command -v node >/dev/null 2>&1; then
  echo "▶ Starte Server mit Node.js"
  npx serve . -l "$PORT" &
  SERVER_PID=$!
else
  echo "▶ Node.js nicht gefunden, nutze Python"
  python -m http.server "$PORT" &
  SERVER_PID=$!
fi

sleep 1
xdg-open "http://localhost:$PORT"

wait "$SERVER_PID"
