# Dences Computers & Mobile

Responsive customer storefront for the two Dences shops. This phase uses sample products and local request previews. The operational ERP and backend are deferred.

## Project layout

```text
frontend/              Next.js source, assets, tests, package lock and Dockerfiles
backend/               Reserved business modules and backend instructions
packages/contracts/    Reserved shared API contracts
infra/docker/          Container operating guide
docs/architecture/     Current and proposed architecture
docs/diagrams/         System, order and offline-sync diagrams
scripts/               Network and security helpers
tests/                 Export-server and advisory-data checks
.github/               Quality/security workflows and dependency updates
AGENTS.md              Project-wide agent instructions
DESIGN.md              Canonical Dences design system
PRODUCT.md             Current product scope
compose.yaml           Static frontend container
compose.dev.yaml       Development container with live source mount
```

## Run locally

Use Node 24 (`nvm use` if installed). From the project root:

```sh
npm run setup
npm run dev
```

Open [the site](http://localhost:3000). To preview the production export:

```sh
npm run build
npm start
```

Both servers listen on all local interfaces for same-network phone access. Run `npm run network` for current links. The working link during setup was [172.16.21.97:3000](http://172.16.21.97:3000); the address may change after reconnecting Wi-Fi. Use `http://` and the computer's address in the phone browser. Keep the server terminal running. Phone access was confirmed by the user.

The frontend owns `frontend/package-lock.json`; root commands are shortcuts. Do not run root `npm ci`. Output is `frontend/out/`; `npm start` serves exported files and clean routes rather than running `next start`. `/healthz` supports container probes. The preview retains anti-framing and MIME protections; internet hosting still needs HTTPS and appropriate reverse-proxy/header configuration.

## Docker

With an accessible Docker Engine and Compose plugin:

```sh
docker compose config --quiet
npm run docker:up
```

Default port: 3000. Stop an existing local preview first, or use `FRONTEND_PORT=3001 npm run docker:up`. Development: `npm run docker:dev`. Stop production: `npm run docker:down`. Read [container instructions](infra/docker/README.md).

Compose syntax has been validated. Local image builds, startup and image scans remain unverified because this account cannot access the Docker daemon and free disk space is below the scanner minimum.

## Verification

```sh
npm run typecheck
npm run format:check
npm run build
npm test
npm run audit:security
npm run security:secrets
```

Build before testing: the HTTP smoke test checks real exported pages from a different working directory. [Security notes](docs/frontend-security.md) cover image scans and required checks. Workflow files do not initialize Git, enforce branch protection, push or deploy anything.

## Features and limits

Catalogue/search/filters, product pages, saved items, cart, quotation/order/contact previews, text downloads, browser print/PDF and local receipt selection are implemented. Cart and saved items persist locally; contact details and receipt files stay in current page state. No request is submitted, receipt uploaded, stock reserved or payment verified. Prices/configurations are labelled sample data. No payment gateway is planned.

Supply real products, contacts, bank instructions, warranty/delivery terms and cleared imagery before production. No contact numbers or bank details were invented.

Read the [architecture](docs/architecture/README.md), [diagrams](docs/diagrams/README.md), [plan](docs/development-plan.md), [asset notes](docs/frontend-assets.md) and [verification record](docs/frontend-verification.md).
