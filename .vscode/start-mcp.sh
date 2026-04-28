#!/bin/bash

if command -v bun >/dev/null 2>&1; then
  exec bun dist/index.js "$@"
else
  exec node dist/index.js "$@"
fi