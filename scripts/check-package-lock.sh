#!/usr/bin/env bash

# This script checks package-lock.json for references to private npm registries.
# Developers using ~/.npmrc with a private Artifactory registry will have their
# package-lock.json updated with internal registry URLs in the "resolved" fields,
# which cannot be committed to the public repo.

LOCKFILE="package-lock.json"

# Check for any mitre.org subdomain in resolved URLs (e.g., private Artifactory)
FORBIDDEN_PATTERN='[a-zA-Z0-9.-]*\.mitre\.org'

if [ ! -f "$LOCKFILE" ]; then
    echo "✓ No package-lock.json found, skipping check."
    exit 0
fi

# Look specifically for "resolved" fields pointing to mitre.org subdomains
if grep -E '"resolved":\s*"https?://'"$FORBIDDEN_PATTERN" "$LOCKFILE" > /dev/null; then
    echo "✗ ERROR: package-lock.json contains 'resolved' URLs pointing to a private registry"
    echo ""
    echo "  This happens when your ~/.npmrc is configured to use an internal"
    echo "  Artifactory registry. Committing this file would break CI pipelines"
    echo "  that run on public GitHub runners without access to the private registry."
    echo ""
    echo "  To fix this:"
    echo "    1. Temporarily rename or remove your ~/.npmrc"
    echo "    2. Delete node_modules/ and package-lock.json"
    echo "    3. Run 'npm install' to regenerate with the public registry"
    echo "    4. Restore your ~/.npmrc"
    echo ""
    exit 1
fi

echo "✓ package-lock.json is clean (no private registry references found)."
exit 0