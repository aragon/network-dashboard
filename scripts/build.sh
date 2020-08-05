#!/usr/bin/env sh
set -e

# Build number from the short hash
if [ -n "$NOW_GITHUB_COMMIT_SHA" ]; then
  build=$(echo "$NOW_GITHUB_COMMIT_SHA" | cut -c1-7)
elif [ -n "$GITHUB_SHA" ]; then
  build=$(echo "$GITHUB_SHA" | cut -c1-7)
else
  build=$(git log --pretty=format:'%h' -n 1)
fi

echo "Build: $build"
echo ""

echo "Syncing assets…"
echo ""
npm run sync-assets

echo "Building app…"
echo ""
cross-env BUILD=$build parcel build src/index.html --out-dir ./public --public-url ./ --no-cache
