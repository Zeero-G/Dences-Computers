# Frontend security and CI handoff

Prepared for the frontend-only phase using the requested Secure Project CI and Secure Dependencies skills.

## Configured locally

- Locked npm tree in `frontend/`, Node 24 runtime declaration, formatting/type/build checks, cart/receipt validation and exported-server HTTP tests.
- GitHub Actions quality, dependency audit and secret-scanning jobs, with a stable aggregate `Required frontend checks` rejecting every prerequisite result other than success.
- PR jobs have read-only repository permission, checkout credential persistence disabled, no production secrets and no deployment.
- Daily advisory audits and weekly scoped npm/Action/Docker update proposals once the repository is hosted and workflows enabled.
- Actions pinned to verified official tag commit revisions: checkout v7.0.1 `3d3c42e5aac5ba805825da76410c181273ba90b1`, setup-node v7.1.0 `949feb2413d6458794dcd2491c4babbbce0c15c1`.
- Gitleaks v8.30.1 Linux x64 archive checksum verified from the official release checksum file: `551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb`. Tool updates require checking the corresponding new archive/checksum. Scanner failures stop the job.
- Secret scanning uses redacted results for history and current files. Only generated output, installed packages and screenshot directories are excluded; source and docs remain in scope.
- npm audit covers runtime and development/build dependencies and fails at High/Critical; advisory/network failures are failures. No suppressions or forced fixes.
- Browser cart data is parsed defensively. No private receipts/contact data is written to persistent browser storage. UI file checks are convenience only; backend upload validation is still required in the future.

## Execution evidence

The initial resolved dependency audit reported zero known vulnerabilities. The initial redacted current-file secret scan found no leaks. There is no initialized Git repository/history in this workspace, so a local history scan could not run. Record final build/check evidence in the handoff; do not confuse these local checks with hosted CI results.

## Before production

1. Initialize/connect the intended repository and default branch. No commits or pushes have been made by this task.
2. Run CI on the actual pull request/release revision; make `Required frontend checks` and `Required container checks` required in branch rules, with up-to-date branch/merge-queue policy and controlled bypass. PRs validate GitHub's test-merge revision; push validates the pushed revision and merge_group validates its queue revision. Workflow files do not enforce repository settings.
3. Protect any future deployment environment and validate the exact release revision/artifact before deployment. No deployment job is supplied for this local preview.
4. Run the prepared container workflow: build runtime, builder and development targets, exercise hardened runtime/health/routes, then scan all three images. Dockerfiles/configurations are prepared but local image execution is blocked by daemon permissions. This is not a clean container audit result.
5. For the later backend, implement authenticated/authorized order access, rate limits, CSRF protection as applicable, content/type/size and malware validation of private evidence, server-side price/stock checks, and audit trails. A frontend preview cannot enforce these controls.
6. Choose a production host and configure HTTPS, appropriate CSP and headers. Test policies against Next-generated scripts rather than copying an unverified CSP that breaks rendering.
7. Verify the actual configured update-bot behavior and scanner pins. The initial workflow schedules do not prove monitoring is running.

## Container supply chain

The Node 24 bookworm-slim digest is pinned in both Dockerfiles. Trivy v0.76.2 Linux x64 uses upstream SHA256 `bc0fc726e017b8927a62b2d3531d7a84ee01769daf5c99ed866dced54089fdbf`. Pins were checked against official registry/release metadata on 9 November 2026. See the [upstream checksums](https://github.com/aquasecurity/trivy/releases/download/v0.76.2/trivy_0.76.2_checksums.txt), [database options](https://trivy.dev/docs/latest/configuration/db/) and [image command](https://trivy.dev/docs/latest/references/configuration/cli/trivy_image/).

The scanner uses a fresh temporary advisory database, rejects unsupported schema, missing/empty data, future timestamps, age over 48 hours or an expired NextUpdate, and includes unfixed High/Critical vulnerabilities. Tests exercise these failure conditions. No cross-run advisory cache, secret-bearing refresh job or scan suppression is supplied. Hosted runners and live registry/advisory inputs still move; pins do not make the entire pipeline reproducible.

Run `npm run security:containers` only after building all three documented image tags. Scanner binaries use verified archive checksums; updating them requires upstream verification. Full [container commands](../infra/docker/README.md) cover prerequisites and the current execution limit.
