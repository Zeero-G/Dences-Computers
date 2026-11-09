# Backend scaffold — planned phase

The backend is intentionally not implemented yet. This folder prepares a place for the business rules that will connect the storefront, staff ERP and shop billing services.

Keep the agreed Node.js + TypeScript direction. Next.js route handlers can expose these modules when the frontend stops being a static export. A separate API service is a future architectural decision, not introduced by this folder move.

Planned modules: inventory/serialized units, purchasing and suppliers, sales/billing/quotations, orders/fulfilment, payment review, warranties/returns/replacements, consignment, cash/expenses/reporting, authorization/audit, and offline synchronization.

Planned persistence: PostgreSQL with Prisma. Planned staff authentication: Better Auth with server-enforced shop/role policies. No database, migrations, authentication, business API, fake health server, credentials or payments are created in this phase.

There is no backend Dockerfile because there is no runnable backend artifact yet. The two executable frontend Dockerfiles cover the current development and production export. Add a backend Dockerfile and independent tests/audits only when its real runtime is implemented.
