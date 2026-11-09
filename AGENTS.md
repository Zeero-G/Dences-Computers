# Dences project instructions

## Read first

Read PRODUCT.md, DESIGN.md, docs/architecture/README.md and the relevant child AGENTS.md. Preserve user work. This checkout has no initialized Git history; do not claim commits, pushes or hosted CI results.

## Layout and scope

- `frontend/` is the implemented Next.js customer site, with its own package.json and package-lock.json. Run dependency installs/audits in that folder. Root package.json contains command aliases only, no independent dependency tree.
- `backend/` is a future business-logic scaffold, not an implemented API. Keep the approved Node.js/TypeScript/Next.js direction. Do not introduce Express, a second authentication system, databases or fake business endpoints merely to fill this folder.
- `packages/contracts/` reserves shared API/domain contracts for the connected phase.
- `infra/` documents container and hosting operation; root Compose files run the frontend only.
- `docs/architecture/` and `docs/diagrams/` describe current versus planned systems. Distinguish diagrams of proposed modules from implemented services.
- Root `scripts/` contains repository/security/network helpers; `frontend/scripts/` contains frontend runtime helpers.

## Commands from root

Use Node 24. `npm run setup` installs the frontend lockfile. `npm run dev`, `npm start`, `npm run build`, `npm run typecheck`, `npm run format:check`, `npm test`, `npm run audit:security`, `npm run security:secrets`, and `npm run network` are root shortcuts. Run the build before the root HTTP smoke test. There is intentionally no root dependency lockfile; do not use root `npm ci` as an app installation.

`docker compose config --quiet` validates production config; `docker compose -f compose.dev.yaml config --quiet` validates development config. `docker compose up -d --build --wait frontend` starts the static site. These checks require a usable Docker daemon for builds/runs. Do not change host Docker-group membership or request secrets to bypass permissions.

## Networking

The user explicitly wants same-Wi-Fi phone access. Frontend listeners default to 0.0.0.0 and print local IPv4 links. A phone must use the computer's current LAN address, not localhost or 0.0.0.0. Keep the existing anti-framing, nosniff and referrer headers. Do not disable the firewall or router isolation; any firewall exception should be restricted to the intended local subnet and frontend TCP port. Do not expose future backend/database/admin ports as part of this preview.

## Product and data boundaries

Keep sample products/prices and request previews clearly labelled. No real payment verification, stock reservation, order submission or receipt upload exists. Never invent shop contacts, bank details, delivery policies or warranties. Do not persist contact details or receipts in browser storage. Keep product edits, financial rights and authority decisions for the backend phase.

## Design

Follow root DESIGN.md and the approved Dences/Figma reference. Use the existing logo, General Sans, neutral palette and component patterns. Respect reduced motion, accessible semantics and mobile layouts. Do not duplicate or replace the design system to reorganize folders. Changes to the reference direction require user direction.

## Security and verification

Apply Secure Dependencies for app/tool changes and Secure Project CI for workflows/containers. Keep full verified Action SHAs and image digests; never invent pins. Scan runtime and build/development dependencies; scan builder and runtime containers separately. Do not omit unfixed vulnerabilities or hide scanner/advisory failures. Run relevant tests, type/build/format checks, clean installs when dependency inputs change, and update actual commands in docs.

Root `.github/` workflows validate the actual frontend root and container targets. No production secrets in PR jobs, no automatic publication, no claims of enforced branch rules until verified remotely. Preserve the stable required aggregate check. Future publishing needs exact-revision/artifact validation and the user's actual authorization.
