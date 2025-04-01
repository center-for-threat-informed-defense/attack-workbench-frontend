#!/bin/bash
#####################################################################
# Docker Build Script for ATT&CK Workbench REST API
#
# Purpose:
#   This script builds and pushes Docker images for the ATT&CK Workbench
#   REST API. It's designed to be called by semantic-release during
#   the GitHub Actions CI/CD pipeline.
#
# Usage:
#   ./docker-build.sh <version> <release_type> <git_sha>
#
# Parameters:
#   - version: Semantic version (e.g. 1.2.3 or 1.2.3-alpha.1)
#   - release_type: Type of release (e.g. "major", "minor", "patch", "prerelease")
#   - git_sha: Git commit SHA of the build
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
BUILDTIME=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
IMAGE_NAME="ghcr.io/center-for-threat-informed-defense/attack-workbench-rest-api"

echo "Building Docker image for version: $VERSION (release type: $RELEASE_TYPE)"

# Construct the base Docker buildx command with common parameters
BUILD_CMD="docker buildx build --push --platform linux/amd64,linux/arm64"
BUILD_CMD+=" --build-arg VERSION=$VERSION"
BUILD_CMD+=" --build-arg BUILDTIME=$BUILDTIME"
BUILD_CMD+=" --build-arg REVISION=$REVISION"
BUILD_CMD+=" -t $IMAGE_NAME:$VERSION"

# Add the 'latest' tag only for non-prerelease versions (main/master branches)
if [[ "$RELEASE_TYPE" != "prerelease" ]]; then
    echo "Adding latest tag (non-prerelease build)"
    BUILD_CMD+=" -t $IMAGE_NAME:latest"
else
    echo "Skipping latest tag (prerelease build)"
fi

# Execute the final constructed Docker build command
$BUILD_CMD .

# Log completion status (will only run if build is successful due to set -e)
echo "Docker build and push completed successfully"