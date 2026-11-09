#!/usr/bin/env bash
set -euo pipefail
scanner_version=8.30.1
scanner_sha=551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb
scanner_dir="$(mktemp -d)"
trap 'rm -rf "$scanner_dir"' EXIT
curl --fail --location --silent --show-error --max-time 120 "https://github.com/gitleaks/gitleaks/releases/download/v${scanner_version}/gitleaks_${scanner_version}_linux_x64.tar.gz" --output "$scanner_dir/scanner.tar.gz"
printf '%s  %s\n' "$scanner_sha" "$scanner_dir/scanner.tar.gz" | sha256sum --check --status
tar -xzf "$scanner_dir/scanner.tar.gz" -C "$scanner_dir" gitleaks
# History and current files are independent scans. Never print matched secrets.
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  "$scanner_dir/gitleaks" git --redact --no-banner --log-opts="--all"
else
  printf '%s\n' 'History scan unavailable: no initialized Git repository. Current-file scan follows.'
fi
"$scanner_dir/gitleaks" dir --redact --no-banner .
