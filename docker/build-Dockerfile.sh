#!/bin/bash
#####################################################################
# Docker Build Script for ATT&CK Workbench Frontend
#
# Purpose:
#   This script builds and pushes Docker images for the ATT&CK Workbench
#   Frontend. It's designed to be called by semantic-release during
#   the GitHub Actions CI/CD pipeline.
#
# Usage:
#   ./docker-build.sh <version> <release_type> <git_sha>
#
# Parameters:
#   - version: Semantic version (e.g. 1.2.3 or 1.2.3-alpha.1)
#   - release_type: Type of release (e.g. "major", "minor", "patch", "prerelease")
#   - git_sha: Git commit SHA of the build
#   - release_channel (optional): Distribution channel from semantic-release
#       Examples: "main", "master", "next", "next-major", "alpha", "beta", etc.
#       If omitted or "undefined", defaults to "main".
#
# Behavior:
#   - For non-prerelease builds (release_type != "prerelease"),
#     the image is tagged with both the version and "latest"
#   - For prerelease builds (from alpha, beta, etc. branches),
#     the image is tagged only with the version (no "latest")
#
# Called by:
#   .releaserc file via @semantic-release/exec plugin
#####################################################################

set -e

VERSION=$1
RELEASE_TYPE=$2
REVISION=$3
CHANNEL_RAW=$4

# Default channel handling (semantic-release uses undefined for default channel)
if [[ -z "$CHANNEL_RAW" || "$CHANNEL_RAW" == "undefined" ]]; then
  CHANNEL="main"
else
  CHANNEL="$CHANNEL_RAW"
fi

BUILDTIME=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
IMAGE_NAME="ghcr.io/center-for-threat-informed-defense/attack-workbench-frontend"

echo "Building Docker image for version: $VERSION (release type: $RELEASE_TYPE)"

# Construct the base Docker buildx command with common parameters
BUILD_CMD="docker buildx build --push --platform linux/amd64,linux/arm64" # If testing offline, you can include `--load` to load the image into the local Docker regsitry
                                                                          # You may also want to remove `--push`.
BUILD_CMD+=" --build-arg VERSION=$VERSION"
BUILD_CMD+=" --build-arg BUILDTIME=$BUILDTIME"
BUILD_CMD+=" --build-arg REVISION=$REVISION"
BUILD_CMD+=" -t $IMAGE_NAME:$VERSION"

# Determine whether to apply 'latest' based on channel
channel_lc="${CHANNEL,,}"
case "$channel_lc" in
  master|main|next|next-major)
    echo "Channel '$CHANNEL' is a release channel; adding 'latest' tag"
    BUILD_CMD+=" -t $IMAGE_NAME:latest"
    ;;
  *)
    echo "Channel '$CHANNEL' is a pre-release channel; skipping 'latest' tag"
    ;;
esac

# Add 'alpha'/'beta' tags based on VERSION (case-insensitive)
v_lower="${VERSION,,}"

if [[ $v_lower == *alpha* ]]; then
    echo "Adding alpha tag (version contains 'alpha')"
    BUILD_CMD+=" -t $IMAGE_NAME:alpha"
elif [[ $v_lower == *beta* ]]; then
    echo "Adding beta tag (version contains 'beta')"
    BUILD_CMD+=" -t $IMAGE_NAME:beta"
fi


# Execute the final constructed Docker build command
$BUILD_CMD .

# Log completion status (will only run if build is successful due to set -e)
echo "Docker build and push completed successfully"