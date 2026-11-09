# Frontend instructions

Read the project-wide ../AGENTS.md, ../PRODUCT.md and ../DESIGN.md first. This directory owns package.json, package-lock.json, source, public assets, tests and the export server. Run npm ci here, or npm run setup from the project root. Root task aliases are documented in ../README.md. Build before the root HTTP smoke test. Backend operations are deferred; keep demo boundaries explicit.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
