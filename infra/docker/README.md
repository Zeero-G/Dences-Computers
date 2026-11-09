# Docker operation

Run commands from the project root. A working Docker Engine and Compose plugin are required. Local scanning also needs Node 24, curl, tar, sha256sum and at least 2 GiB free temporary space, in addition to Docker image storage. The scan script checks daemon access and free space before downloads.

## Static frontend

`frontend/Dockerfile` builds the Next.js export and copies only static output and the Node preview server into the runtime image. Build tools remain in the builder. The runtime runs as `node`, exposes port 3000 and checks `/healthz`.

```sh
docker compose config --quiet
docker compose up -d --build --wait frontend
docker compose logs --tail=50 frontend
docker compose down
```

Compose adds a read-only filesystem, temporary directory, dropped capabilities, no-new-privileges and resource limits. Hosted CI is configured to check these settings and clean product routes; those container checks have not run locally.

The default binds all interfaces for phone preview. Set `FRONTEND_BIND_ADDRESS=127.0.0.1` for computer-only access, or `FRONTEND_PORT=3001` if 3000 is occupied. Root `.env.example` documents Compose variables. An optional `.env` is ignored. Do not put credentials in build arguments.

## Development

```sh
docker compose -f compose.dev.yaml config --quiet
docker compose -f compose.dev.yaml up --build
docker compose -f compose.dev.yaml down
```

Source is mounted from `frontend/`; node_modules and .next use named volumes. After a lockfile change, stop development and run `docker compose -f compose.dev.yaml down --volumes`, then rebuild to recreate dependency volumes. This removes disposable development volumes; there is no database volume. Dev and production cannot use the same host port simultaneously.

## Image audit

```sh
docker compose build frontend
docker build --target builder --tag dences-builder:local frontend
docker build --file frontend/Dockerfile.dev --tag dences-development:local frontend
npm run security:containers
```

Checksum-pinned Trivy downloads a fresh database into a temporary directory, checks schema/timestamps/nonempty data, and audits all three images, including unfixed High/Critical findings. Scan/download/database failures block the job. Advisory data must be no older than 48 hours, not future-dated and before its NextUpdate time. No advisory credentials, shared advisory cache or suppressions are used. OCI transport provides database artifact integrity; the metadata check is a freshness/schema guard, not independent signature verification.

Node image digests and scanner checksums are pinned in the Dockerfiles/scripts. Dependabot proposes Dockerfile updates. Trivy/Gitleaks pins require manual upstream release/checksum review. Review compatibility and findings before merging.

## Verification limit

Docker is installed here but this account cannot access its daemon socket. Disk space also remains below the scanner minimum. A scanner retry verified the binary checksum but failed while extracting the real advisory database because the disk filled; temporary scanner data was cleaned up. Compose validation works; builds, startup, hardening checks and image audits must run with an authorized Docker setup or on the prepared GitHub runner. Do not make the socket world-writable or disable controls. No backend/database image is supplied because those services are not implemented.
