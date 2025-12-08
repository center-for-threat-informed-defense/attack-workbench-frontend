#!/usr/bin/env bash

# This script checks package-lock.json for references to internal Artifactory.
# Developers using ~/.npmrc with artifacts.mitre.org will have their package-lock.json
# updated with internal registry URLs, which cannot be committed to the public repo.

LOCKFILE="package-lock.json"
FORBIDDEN_PATTERN="artifacts.mitre.org"

if [ ! -f "$LOCKFILE" ]; then
    echo "✓ No package-lock.json found, skipping check."
    exit 0
fi

if grep -q "$FORBIDDEN_PATTERN" "$LOCKFILE"; then
    echo "✗ ERROR: package-lock.json contains references to '$FORBIDDEN_PATTERN'"
    echo ""
    echo "  This happens when your ~/.npmrc is configured to use the internal"
    echo "  Artifactory registry. Committing this file would break CI pipelines"
    echo "  that run on public GitHub runners without access to Artifactory."
    echo ""
    echo "  To fix this:"
    echo "    1. Temporarily rename or remove your ~/.npmrc"
    echo "    2. Delete node_modules/ and package-lock.json"
    echo "    3. Run 'npm install' to regenerate with the public registry"
    echo "    4. Restore your ~/.npmrc"
    echo ""
    exit 1
fi

echo "✓ package-lock.json is clean (no internal registry references found)."
exit 0
