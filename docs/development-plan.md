# Dences Computers & Mobile — development plan

Prepared 9 November 2026, Asia/Colombo.

The user has approved continuing with Dences branding and the supplied Figma kit. This document defines the broader build sequence and acceptance criteria. Subsequent user direction moved the customer frontend first: it is now implemented using sample data and local request previews. The ERP, backend, deployment, paid services and hosted CI enforcement remain deferred. See [frontend-verification.md](frontend-verification.md) for completed checks and outstanding visual recapture.

## 1. Product structure

One connected product with three experiences:

1. Public storefront: browse, select items, request quotations, contact the shop, submit orders, and upload bank-payment evidence.
2. Staff ERP: catalogue, inventory, purchasing, billing, online orders, warranties/replacements, consignment, cash management, and reports.
3. Local shop billing: continue sales and receipt printing during internet outages, then synchronize with the cloud.

Keep the computer shop and phone shop's stock and cash separate. Share product definitions and branding. The owner sees individual shops and combined totals. No automatic stock sharing or branch-transfer workflow is required for these two shops in this scope.

## 2. Visual direction

Reference file: [Ecommerce App UI Kit](https://www.figma.com/design/4hIHnbYKNJbQhJhdcIIGY5/Ecommerce-App-UI-Kit--Freebie---Community-?node-id=0-1).

Figma MCP access is working. Reviewed page `0:1`, catalogue `120:684`, product details `1:148`, and checkout `130:1054`; session `6827b8eb-a9e1-4f22-9943-afe537c2bb91`. The page contains mobile commerce, authentication, cart, address, and order-history frames. The inspected screens are 390 × 844. Desktop storefront and ERP layouts must be designed separately within the same visual system.

- Identity: Dences Computers & Mobile and the supplied angular logo. Complete and inspect a clean transparent PNG; the initial extraction has rough edges and is not a production asset.
- Palette: white `#FFFFFF`, charcoal `#1A1A1A`, fine gray borders `#E6E6E6`. Use semantic colour sparingly for payment, stock, and error states, with text/icons in addition to colour.
- Typography: preserve the kit's General Sans character if its web-use licence permits; otherwise use an appropriately licensed close alternative. Do not ship mock iOS status bars or the SF Pro system chrome from the reference.
- Controls: restrained rounded corners, clear labels, large touch targets, visible keyboard focus, and usable contrast.
- Storefront: desktop header and search, category navigation, adaptive product grids, desktop filter sidebar/mobile filter drawer, and product-image/specification layouts.
- ERP: sidebar on desktop, compact navigation on mobile, shop selector, fast search, readable tables, focused forms, and a dedicated billing workspace. Do not squeeze an entire desktop table into a narrow viewport.
- Motion: light spring feedback for cart additions and drawers, short layout transitions, and immediate frequent staff actions. Respect reduced motion and keyboard/touch interaction.
- Remove clothing-specific controls, saved-card entry, Apple Pay, unnecessary onboarding/splash screens, placeholder reviews, tax rows, and unsupported features. Replace fashion photos with actual supplied product assets; do not present invented products, ratings, or discounts as business facts.
- Establish shared design tokens and components before building the full screen set. Use Impeccable, relevant frontend guidance, and Emil animation guidance while honoring the chosen Figma reference.

Before shipping, verify template and font usage terms. A community/freebie title alone is not licence evidence.

## 3. Recommended technical architecture

| Responsibility       | Choice                                                                              |
| -------------------- | ----------------------------------------------------------------------------------- |
| Web application      | Next.js, React, TypeScript                                                          |
| UI                   | Tailwind CSS with customized accessible Radix/shadcn components                     |
| Animation            | Motion for React and CSS transitions                                                |
| Cloud database       | PostgreSQL                                                                          |
| Data access          | Prisma, with reviewed migrations and database constraints                           |
| Staff authentication | Better Auth; separate server-enforced role/shop policies                            |
| Forms and validation | React Hook Form and Zod                                                             |
| ERP tables           | TanStack Table                                                                      |
| Files                | S3-compatible storage, separated public images/private evidence                     |
| Shop billing host    | Shared TypeScript business modules and local PostgreSQL; a narrow local web service |
| Deployment           | Docker Compose, HTTPS reverse proxy, independent encrypted backups                  |
| Verification         | Vitest, PostgreSQL integration tests, Playwright                                    |
| CI                   | GitHub Actions if the source repository is hosted on GitHub                         |

Use one repository and a modular application. The shop billing service exists because of the offline requirement; do not introduce separate services for every business module. Use current supported patched dependency releases, checked at implementation time under the Secure Dependencies skill. No package versions are selected by this planning document.

### Offline operating model — recommended baseline

Each shop runs one active billing host on an existing suitable PC or a small dedicated computer. Tills reach it through the shop network. The cloud serves public customers and remote management. This depends on the local host and shop network remaining powered and available; it is not protection against power or equipment failure. Include automatic startup, a recovery procedure, secure local access, and a backup plan in the pilot.

The goal is one authority per shop for physical stock allocation, including while online. Do not allow the cloud and local service to independently sell the same stock:

- Shop stock movements, purchases becoming sellable, in-store sales, and final online-order allocations are committed through the designated shop authority.
- The cloud holds an auditable synchronized projection for reporting and public availability. Cloud procurement/adjustment requests remain pending until the shop authority acknowledges them; they do not silently change sellable stock.
- Online requests can arrive during an outage, but show that availability and acceptance require confirmation. Do not invite payment against a binding allocation until stock has been acknowledged by its shop authority. Unsolicited payment evidence still requires exception review.
- An authorized worker can accept an online order only after stock is allocated by the shop authority and payment is verified where required. Disconnected cloud review cannot finalize an allocation.
- Every operation has a unique identifier, shop identifier, actor, timestamp, and sequence/version. Save business changes and outgoing sync events atomically; process deliveries idempotently and preserve per-shop ordering.
- Receipt numbers contain a shop/authority prefix and local sequence so offline bills remain unique and unchanged after sync. Reprinting is not a new sale.
- Reconnection drains a durable queue and displays last sync, pending count, and failures. Never resolve money or stock conflicts by blindly taking the latest edit.
- Refunds, replacements, returns to stock, and consignment allocations use the same authority boundary. Prototype offline sale operations first; explicitly define which other operations are online-only before implementing their screens.
- Local workers receive only permitted product/sale data. Do not replicate profit or purchase-cost fields into a worker-readable offline browser store. Protect the host database and backups from ordinary browser access.
- Define time-limited offline staff access, session expiry, and delayed revocation during outages. Record offline actions; synchronize revocation and stop new actions when authorization expires.
- Replacing a host requires a controlled authority handover, reconciliation, and sequence recovery. Do not run an old and replacement host as simultaneous stock writers.

Prove this in the first engineering milestone. A browser-only alternative is possible for a designated single till, but would need a separate durability and stock-ownership design; a PWA cache alone does not deliver reliable financial synchronization.

## 4. Permissions

| Capability                                                   | Worker                           | Owner              | Technician                       |
| ------------------------------------------------------------ | -------------------------------- | ------------------ | -------------------------------- |
| View public catalogue and selling prices                     | Yes                              | Yes                | Yes                              |
| Create/edit descriptions, images, categories, selling prices | Yes                              | Yes                | Yes                              |
| Change sale price and give discounts                         | Yes, audited                     | Yes                | Yes                              |
| Review payment evidence and arrange orders                   | Yes, subject to allocation rules | Yes                | Only with operational permission |
| View purchase costs and profit                               | No                               | Yes                | Yes, as requested                |
| Financial corrections, refunds, stock adjustments            | Owner approval by default        | Yes                | Explicit permission required     |
| Manage workers and permissions                               | No                               | Yes                | Maintenance permission only      |
| Maintenance, migrations, recovery                            | No                               | Business oversight | Yes, logged                      |

Default for planning: workers may save catalogue drafts; owner/technician publication approval until the business chooses otherwise. Separate editing a selling price from recording cost, receiving stock, or changing quantities. Archive referenced records rather than deleting transaction history. Apply permissions to APIs, exports, attachments, offline data, and reports.

## 5. Main customer journeys

### Quotation/contact order

Browse → choose variant and quantity → quotation/contact request → staff check stock and final price → issue quotation → customer agrees → allocate stock and collect/verify full payment → prepare → deliver or hand over.

### Order with bank receipt

Select items → submit contact/delivery details → request stock confirmation → receive confirmed quotation/payment instructions → transfer funds → submit trace/reference and private receipt → staff check the actual payment → record verification → prepare → dispatch → deliver.

Uploading evidence is not proof of payment. Order acceptance, payment verification, and delivery each have separate states and actors. Do not count a quote, submitted order, receipt upload, or consignment handover as sale revenue. Define the sale-posting point and use it consistently for stock/cost/revenue and reports. Accepted paid orders may have reserved stock pending dispatch; do not deduct the same unit again at handover.

Guest checkout with name and contact details is the proposed initial default, not a confirmed requirement. Give access to order details through a secure token or verified contact mechanism; an easily guessed order number is not authorization. Keep optional customer accounts as a decision before that flow is implemented.

## 6. Data and business rules

Core records: shops, staff/permissions, customers, suppliers, outside shops, categories, products, variants, serialized units, quantity stock, purchases, landed-cost allocations, supplier payments, stock movements, consignments, quotations, orders, reservations, sale lines, payments/evidence, fulfilments, expenses, cash sessions, accounts/transfers, returns/refunds, warranty replacements, audit events, and synchronization events.

- Store money as exact minor units or fixed-precision decimal and apply one documented rounding policy. Record LKR consistently.
- Store timestamps consistently and report business dates in Asia/Colombo. Define week boundaries, yearly date range, and cash-shift boundaries.
- Snapshot price, description, discount, condition, and warranty terms on issued documents. Later catalogue edits must not rewrite old receipts.
- Track optional warranty explicitly; no warranty is a valid value. Preserve original and replacement IMEI/serial links, including dual-IMEI devices where applicable.
- Define physical on-hand, reserved, available, consigned, faulty, and sold states. Consigned/faulty stock is not available for normal sale.
- Prevent duplicate device identifiers where appropriate; distinguish manufacturer serial rules and barcode identifiers from IMEI validation.
- Propose specific acquisition cost for serialized devices and moving weighted-average cost for quantity items. Confirm with the owner before reporting profit. Allocate import charges with a documented rule.
- Supplier balances derive from purchases, credits, and payments. Consignment balances derive from acknowledged sales/returns/settlements, not simply dispatched items.
- Internal transfers and owner contributions are not sales. Salary payments are expense records, not a payroll calculation engine.
- Represent corrections through reversals/linked adjustments. Lock closed cash sessions against silent edits.
- Protect against duplicate clicks, transaction retries, concurrent stock claims, stale prices, repeated payment verification, and duplicate evidence references. Flag suspicious reused references for human review rather than assuming all reused references are invalid.

## 7. Build milestones and completion checks

| Milestone                           | Deliverables                                                                                                                                               | Completion evidence                                                                                                                                                                                       |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Foundation and offline proof     | Project setup, shared modules, local/cloud test setup, sample serial/quantity stock, offline sale and print, durable sync, basic CI                        | Disconnect internet, bill/print, restart local service, reconnect, replay sync; exactly one sale, stock deduction, payment, and unchanged bill number. Concurrent online claim cannot take the same unit. |
| 2. Brand and UI foundation          | Final logo asset, licensed font/template checks, shared tokens/components, mobile/desktop catalogue, product, billing, and dashboard prototypes            | Review actual target screens on phone and desktop; keyboard navigation, contrast, reduced motion, readable density; no claim of functional backend from prototypes.                                       |
| 3. Staff and inventory              | Accounts, permissions, two shops, products/variants, IMEI/serial/quantity stock, barcodes, opening import, counts, alerts, supplier purchases/import costs | Roles are enforced through API and export tests; imports validate before applying; audited stock movements reconcile to balances.                                                                         |
| 4. Billing and after-sales          | Quotations, discounts, full-payment sales, thermal/A4/PDF documents, optional warranties, exchanges, refunds, replacements                                 | Real printer checks; transaction totals, stock and serial links survive return/replacement flows; unauthorized actions fail.                                                                              |
| 5. Customer storefront and orders   | Dences catalogue, filters, product details, cart, quotations/contact, manual payment instructions, private evidence, review queue, fulfilment              | Customer submits request, staff confirms stock, verifies payment, and arranges delivery; public users cannot access internal prices or another customer's evidence.                                       |
| 6. Business money and outside shops | Cash closing, expenses, supplier balances, account transfers, owner movements, salary records, direct outside-shop sales and consignment                   | Cash reconciles, consignment sales/returns/settlements reconcile, and no internal transfer is counted as revenue.                                                                                         |
| 7. Reporting and recovery           | Period/shop reports, costing/profit, exports, audit search, monitoring, database and file backups, restore/runbooks                                        | Reconcile a known sample trading period; restore database and attachments into a clean environment; show delayed shop data as pending sync.                                                               |
| 8. Pilot and launch                 | Physical stock count/import reconciliation, staff training, staging acceptance, protected release, pilot rollout                                           | Pilot one shop, reconcile daily through outage/recovery and closing checks, then roll out the second. Launch only with passing release checks and an owner-approved opening inventory.                    |

Security, permissions, accessibility, and transactional correctness apply throughout. These milestones are a dependency order, not removed features. Avoid promising a finish date before the offline/printer proof and shop hardware are assessed.

## 8. Secure Project CI

Implement the requested Secure Project CI skill once there is an actual repository and application:

1. Locked installs; type/lint/build checks; meaningful unit, real-PostgreSQL integration, and browser tests.
2. Redacted secret scans across history and current content; rotation if actual credentials are discovered.
3. Dependency audits including runtime, development, test, and build dependencies; builder/runtime container scans.
4. Default block on High/Critical findings; fail closed for scan failures or unavailable/stale advisory evidence. Any exceptions need specific evidence and expiry.
5. Verify immutable Action/tool/image pins and configure scoped update automation.
6. No production secrets or privileged tokens in PR validation; read-only credentials where possible.
7. Stable required aggregate check rejecting absent, failed, skipped, and cancelled prerequisite checks.
8. Separate protected release validates the exact candidate revision and verified artifacts; do not rebuild unverified different artifacts during deployment.
9. Test server-side role boundaries, private uploads, stock concurrency, duplicate payments, offline replay, and recovery.
10. Document repository branch rules, deployment environments, scanner evidence, and owner-side activation separately. A workflow file alone does not enforce account settings.

Quality, dependency, secret and container CI workflows are now prepared under `.github/`. Hosted runs and branch-rule enforcement have not occurred. Dockerfiles and Compose configurations cover the frontend only; local image execution remains blocked by daemon permissions. Deployment and paid hosting have not been performed. See [architecture](architecture/README.md) and [verification](frontend-verification.md).

## 9. Hosting and operations

Preferred budget model: one paid cloud VPS for the public app, cloud database, and synchronized reporting, plus private object storage/backups and the two local shop hosts. Size and select a region after a basic load/latency test. Hetzner is a candidate, not a purchased or selected plan. A managed PostgreSQL option reduces maintenance but increases recurring cost. Evaluate total cost including backups, file storage, domain, email, monitoring, taxes, and local equipment; do not quote an unverified flat hosting price.

Keep development, staging, and production data separate. Avoid uploading real customer payment evidence into development environments. Define backup frequency, retention, acceptable data loss and recovery time with the owner. Monitor cloud health, storage, backup failures, last shop sync, and stuck payment/order queues. Plan local updates with compatible sync protocols and a safe database migration process.

## 10. Remaining decisions and planning defaults

These do not block the document, but must be resolved before the corresponding feature or purchase:

- Shop hardware and LAN/printer details: baseline is one always-on billing host per shop; validate actual receipt paper widths and A4 printer behavior. Internet outage support does not assume independent offline phones can all write stock.
- Customer accounts: guest requests proposed; the question remains unanswered.
- Contact numbers/channels, addresses, real product data, actual bank instructions: use only provided business details.
- Delivery zones, courier, fees, pickup, and tracking: staff-managed delivery proposed; no courier API assumed.
- Catalogue publication and sensitive worker actions: draft editing for workers; owner controls publication/refunds/stock corrections until delegated.
- Quotation validity and stock reservation expiry: configurable values to agree with the owner.
- Shop-to-shop sharing: excluded as requested; outside-shop direct sales and consignment included.
- Numeric monthly budget and equipment spend: not provided. No service purchase without the user's actual authorization.
- Template/font licence and finished transparent logo: verify before production asset use.

## 11. Source notes

Design observations come from the actual Figma file and screen renders, not an inferred template preview.

- [Next.js self-hosting](https://nextjs.org/docs/app/guides/self-hosting)
- [Next.js PWA guidance](https://nextjs.org/docs/app/guides/progressive-web-apps)
- [PostgreSQL transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)
- [Prisma transactions](https://www.prisma.io/docs/orm/fundamentals/transactions)
- [Better Auth](https://better-auth.com/docs/introduction)
- [Motion for React](https://motion.dev/docs/react-animation)
- [Browser persistent-storage requests](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist)

The local/cloud authority and sync model is the proposed application architecture, not a capability automatically supplied by Next.js, PostgreSQL, Prisma, or a PWA.
