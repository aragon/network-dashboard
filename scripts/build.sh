#!/usr/bin/env sh
set -e

# Current branch
if [ -n "$NOW_GITHUB_COMMIT_REF" ]; then
  # Vercel Now (no .git but an env var)
  branch=$NOW_GITHUB_COMMIT_REF
elif [ -n "$GITHUB_REF" ]; then
  # Github Action
  branch=$GITHUB_REF
else
  # Other environments
  branch=$(git symbolic-ref --short -q HEAD)
fi

# Build number from the short hash
if [ -n "$NOW_GITHUB_COMMIT_SHA" ]; then
  build=$(echo "$NOW_GITHUB_COMMIT_SHA" | cut -c1-7)
elif [ -n "$GITHUB_SHA" ]; then
  build=$(echo "$GITHUB_SHA" | cut -c1-7)
else
  build=$(git log --pretty=format:'%h' -n 1)
fi

echo "Branch: $branch"
echo "Build: $build"
echo ""

echo "Syncing assets…"
echo ""
npm run sync-assets

echo "Building app…"
echo ""
cross-env BUILD=$build parcel build src/index.html --out-dir ./public --public-url ./ --no-cache
