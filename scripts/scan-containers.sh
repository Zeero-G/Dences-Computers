#!/usr/bin/env bash
set -euo pipefail
if ! docker info >/dev/null 2>&1; then
  printf '%s\n' 'Container audit unavailable: a running Docker daemon accessible to this account is required.' >&2
  exit 1
fi
available_kib="$(df -Pk "${TMPDIR:-/tmp}" | awk 'NR==2 {print $4}')"
if [ "$available_kib" -lt 2097152 ]; then
  printf '%s\n' 'Container audit unavailable: at least 2 GiB free temporary space is required for the scanner and advisory database.' >&2
  exit 1
fi
# Linux x64; verify upstream release checksums before changing these pins.
scanner_version=0.76.2
scanner_sha=bc0fc726e017b8927a62b2d3531d7a84ee01769daf5c99ed866dced54089fdbf
scanner_dir="$(mktemp -d)"
trap 'rm -rf "$scanner_dir"' EXIT
curl --fail --location --silent --show-error --max-time 120 \
  "https://github.com/aquasecurity/trivy/releases/download/v${scanner_version}/trivy_${scanner_version}_Linux-64bit.tar.gz" \
  --output "$scanner_dir/scanner.tar.gz"
printf '%s  %s\n' "$scanner_sha" "$scanner_dir/scanner.tar.gz" | sha256sum --check --status
tar -xzf "$scanner_dir/scanner.tar.gz" -C "$scanner_dir" trivy
rm "$scanner_dir/scanner.tar.gz"
# Fresh per-run advisory data, fetched without credentials. No mutable shared cache.
"$scanner_dir/trivy" image --cache-dir "$scanner_dir/cache" --no-progress --download-db-only
node scripts/check-advisory-db.mjs "$scanner_dir/cache/db"
if [ "$#" -eq 0 ]; then
  set -- dences-frontend:local dences-builder:local dences-development:local
fi
for image in "$@"; do
  node scripts/check-advisory-db.mjs "$scanner_dir/cache/db"
  "$scanner_dir/trivy" image --cache-dir "$scanner_dir/cache" --skip-db-update \
    --image-src docker --no-progress --scanners vuln --severity HIGH,CRITICAL --exit-code 1 \
    --ignorefile /dev/null --timeout 10m "$image"
done
