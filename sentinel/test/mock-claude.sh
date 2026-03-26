#!/bin/bash
# Mock claude CLI for testing.
# Echoes the prompt back with a prefix, or handles --version.

while [[ $# -gt 0 ]]; do
  case "$1" in
    --version)
      echo "claude-code 2.1.74"
      exit 0
      ;;
    -p)
      shift
      PROMPT="$1"
      shift
      ;;
    *)
      shift
      ;;
  esac
done

if [[ -n "$PROMPT" ]]; then
  echo "Mock response: $PROMPT"
  exit 0
fi

echo "No prompt provided"
exit 1
