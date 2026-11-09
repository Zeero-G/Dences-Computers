# Proposed connected system

This describes future implementation, not running services. Preserve the frontend-first scope until backend work is requested. The [development plan](../development-plan.md) contains detailed business rules and acceptance criteria.

## Web and server boundary

Use one modular TypeScript codebase. Next.js serves the public catalogue and protected ERP with shared branding. Future route handlers authenticate/validate and call application services in `backend/src/modules/`; a separate Express API is unnecessary initially.

PostgreSQL provides transactions and constraints. Prisma migrations, Zod validation and Better Auth are proposed for implementation-time review. Use one staff authentication approach and explicit role/shop authorization. Shared contracts in `packages/contracts/` define validated inputs/public responses. Do not send cost/profit/private evidence fields to workers or public browsers.

Separate public product photos and private payment/supplier evidence in S3-compatible storage. Private uploads need server-side content/size checks, safe filenames, reviewer authorization, retention and short-lived downloads. A receipt upload does not prove payment. No gateway is required.

## Business modules

| Module          | Responsibility                                                           |
| --------------- | ------------------------------------------------------------------------ |
| Identity/audit  | Individual accounts, roles, shop scope, maintenance history              |
| Catalogue       | Categories, variants, descriptions, photos, publication, selling prices  |
| Inventory       | Shop-specific IMEI/serial units, quantities, barcodes, counts, movements |
| Purchasing      | Suppliers, imports, bills, landed costs, balances, payments              |
| Sales           | Quotations, discounts, full-payment bills, stable print/PDF snapshots    |
| Orders/payments | Customer requests, allocations, private evidence, payment verification   |
| Fulfilment      | Pickup/delivery arrangements and handover history                        |
| After-sales     | Exchanges, refunds, optional warranties, linked replacements             |
| Consignment     | Outside-shop handovers, sales, returns, settlements                      |
| Finance         | Cash closing, expenses, accounts, transfers, owner movements, reports    |
| Synchronization | Durable outbox, ordered/idempotent replay, monitoring, recovery          |

These are internal modules, not separate microservices. Audit worker catalogue edits and discounts. Owner and technician may see purchase costs/profit; workers cannot. Financial corrections default to owner approval. Publication and delegated adjustments still need business confirmation.

## Two shops and offline billing

Computer and phone stock remain separate; owner reports can combine them. Plan one active local stock/billing authority per shop, with durable local PostgreSQL and shared TypeScript business modules. Tills use the shop LAN. The cloud holds a synchronized projection rather than independently selling the same stock.

Commit sale, payment, stock movement, document snapshot and outgoing event atomically. Use unique operation IDs, shop-prefixed immutable bill numbers and per-shop event ordering. Replay at least once; deduplicate transactionally. Never resolve money or stock with last-write-wins. Show sync age, pending events and failures. Host replacement requires controlled authority handover and reconciliation.

Online requests can arrive during an outage. Final allocation needs acknowledgement from the owning shop; disconnected cloud staff cannot finalize it. Verify the actual transfer/card/cash record before accepting payment. Require full payment before releasing goods. Keep order, payment and fulfilment states separate. Quotes and consignment handovers are not sale revenue. Returns/replacements must not deduct or restore stock twice.

Offline authorization needs expiry, a revocation policy, protected storage, startup/recovery and backups. A local PC and LAN must stay powered. Prove restart/retry/concurrent allocation safety before real billing. The current browser cart storage is unrelated to this future durable offline system.

## Data and deployment rules

Use LKR integer minor units or database decimal and one documented rounding policy. Store UTC timestamps and report dates in Asia/Colombo. Snapshot issued descriptions/prices/discounts/conditions/warranties. Use database uniqueness, transactional allocation and idempotency. Corrections are linked reversals; archive referenced products. Preserve original/replacement device links and protect costs in exports/offline data/logs.

Plan Docker, an HTTPS reverse proxy and off-server encrypted backups. Choose hosting after cost, latency and maintenance ownership are agreed; no service has been purchased. Keep database/private storage off preview ports. Separate migration/release credentials from PR validation. Test restore and reconciliation before launch. Current Compose files run the frontend alone.

## Decisions before implementation

Confirm real catalogue/contact/bank details, customer access model, delivery fees/areas, worker publication rights, costing/rounding/report policies, offline tills/host topology and recovery ownership. Recheck supported releases/advisories when adding backend packages. Earlier Tailwind/Radix/form/table recommendations are ERP candidates; the existing storefront CSS does not need migration.
