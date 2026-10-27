#!/bin/sh
# Render poster.html to PNG with headless Chrome.
# Usage: docs/poster/render.sh <out.png> [scale]
set -eu
out=$(cd "$(dirname "$1")" && pwd)/$(basename "$1")
cd "$(dirname "$0")"
scale=${2:-1}
chrome=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
profile=$(mktemp -d)
trap 'rm -rf "$profile"' EXIT

"$chrome" --headless=new --user-data-dir="$profile" --mute-audio \
  --hide-scrollbars --allow-file-access-from-files \
  --window-size=1080,1620 --force-device-scale-factor="$scale" \
  --virtual-time-budget=10000 --screenshot="$out" \
  "file://$PWD/poster.html" >/dev/null 2>&1
echo "$out"
