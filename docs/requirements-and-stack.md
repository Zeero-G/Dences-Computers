# Dences Computers & Mobile — scope and stack recommendation

Status: scope and technology recommendation. The customer frontend has now been implemented first, per the user's latest instruction, with sample data and local request previews. The ERP and backend remain deferred. See [development-plan.md](development-plan.md) for the broader development sequence and [frontend-verification.md](frontend-verification.md) for actual checks and verification limits. Offline billing and receipt printing, with later synchronization, remain requirements for the later shop system.

## Business

One business with two shops: computers and phones. Stock stays separate. The owner needs shop-specific and combined reports. Products include new and used devices, parts/accessories as applicable, and upgrades. Repairs are outside the current scope. Warranty replacement is included. Currency is LKR; interface language is English. Both mobile and desktop access are required.

## Connected storefront and ERP

Use one application and one authoritative database, with a public storefront and a protected staff workspace. Share product definitions, publication details, orders, and availability. Keep stock balances shop-specific. Public data must exclude purchase costs, profit, supplier debt, internal notes, and individual IMEI/serial numbers.

### Storefront

- Catalogue sections for phones, computers, and accessories, with editable categories rather than permanently fixed sections.
- Search and filters by category, brand, condition, price, and availability.
- Product pages with images, specifications, selling price, condition, availability, and optional warranty terms.
- Item selection/cart, quotation requests, and a contact-the-shop order path. Contact channels and actual contact details remain to be confirmed.
- Manual bank-payment instructions, payment-reference entry, and optional payment-receipt upload. No payment gateway.
- Customer contact details, delivery address where needed, and an order reference.
- Staff review of order availability, payment evidence, and delivery arrangements.
- Suggested distinct records: order status, payment status, and fulfilment status. Uploading a receipt does not mark payment as verified.
- Suggested payment states: awaiting payment, evidence submitted, verified, rejected, refunded.
- Suggested fulfilment states: unarranged, preparing, ready for pickup, dispatched, delivered, cancelled.
- Define delivery fees, service areas, pickup availability, reservation expiry, and customer-account requirements before implementation.

### Product administration

Workers, owners, and technicians can add and edit catalogue items, images, descriptions, specifications, categories, and selling prices. Record the actor and changes. Cost, opening stock, stock adjustments, purchase records, and financial fields have separate permissions. Prefer archive/unpublish over deleting products referenced by bills or orders. Worker publication and stock-adjustment permissions need confirmation.

### Inventory and procurement

- Serialized devices: individual IMEI/serial, new/used condition, acquisition cost, status, and shop.
- Quantity-managed items: stock counts and barcode identifiers.
- Product variants where specifications affect stock or price.
- Barcode lookup, label printing, minimum stock levels, stock counts, adjustment reasons, and movement history.
- Supplier bills and attachments, purchase receipts, supplier balances, and payments.
- Imports with allocated freight/customs/other acquisition costs.
- Purchase returns and faulty stock handling.
- Outside-shop direct sales and consignment, tracked separately; consignment handover is not automatically a completed sale.

### Billing and after-sales

- Quotations, receipts, invoices, unique document numbers, thermal and A4 layouts, and PDF downloads.
- Cash, card, and bank-transfer recording with trace/reference numbers and optional evidence.
- Full payment before goods leave; customer credit is excluded.
- Discounts and sale-price changes are allowed for workers, with audit history.
- Optional warranty per product/sale. Preserve warranty and price snapshots on issued documents.
- Exchanges, price differences, refunds, warranty replacements, supplier returns, and inspected return-to-stock decisions.
- Link original and replacement serials; do not overwrite original sale history.

### Money and reporting

- Cash and bank accounts, opening balances, expenses, supplier debts/payments, account transfers, owner contributions/withdrawals, and salary payment records.
- Daily cash closing, expected versus counted cash, and recorded discrepancies.
- Daily, weekly, monthly, yearly, and custom-date reports by shop and business total.
- Sales, stock value, cost of goods sold, gross/net profit, expenses, payment methods, returns, discounts, supplier debts, and outside-shop settlements.
- Excel/PDF exports. No tax engine or full statutory accounting ledger in the current scope.
- Customer credit balances are excluded. Supplier and consignment receivables/payables remain included.

## Roles and data protection

- Owner: overall business and financial administration.
- Worker: permitted shop operations, selling prices, discounts, catalogue editing, and online order/payment review. Purchase costs and profit are hidden.
- Technician: maintenance access plus cost/profit visibility as requested. Avoid shared accounts; record maintenance actions and keep production credentials out of ordinary worker access.
- Default proposal: owner authorization for refunds, stock adjustments, and financial corrections until explicitly delegated.
- Enforce permissions on the server and exports as well as the interface. Never send hidden cost/profit fields to unauthorized browsers.
- Payment evidence is private, accessible only to authorized reviewers through short-lived access. Validate file types, content, and sizes; scan uploads before review where feasible. Product photos are public assets; payment receipts are not.

## Recommended stack

One modular TypeScript application is the recommended starting architecture. Keep inventory, billing, purchasing, payments, and fulfilment as clear internal modules without separate microservices.

| Layer                      | Recommendation                                                                         | Purpose                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Web and application server | Next.js with React and TypeScript                                                      | Public catalogue and protected ERP in one codebase; shared application services |
| Styling and components     | Tailwind CSS and accessible Radix/shadcn components, customized to the supplied design | Shared visual tokens and usable forms/dialogs                                   |
| Animation                  | Motion for React plus simple CSS transitions                                           | Restrained spring interactions and smooth layout changes                        |
| Database                   | PostgreSQL                                                                             | Relational inventory, orders, stock movements, and financial records            |
| Database access            | Prisma                                                                                 | Schema migrations and transactional operations                                  |
| Authentication             | Better Auth                                                                            | Staff accounts and sessions; application-level role and shop checks             |
| Validation and forms       | Zod and React Hook Form                                                                | Shared input validation and usable staff forms                                  |
| Tables                     | TanStack Table                                                                         | Search, sorting, filtering, and pagination for ERP records                      |
| File storage               | S3-compatible object storage                                                           | Separate public product photos and private payment/supplier evidence            |
| Printing                   | Dedicated thermal/A4 print layouts and server-generated PDFs                           | Stable sale/quotation snapshots and downloadable copies                         |
| Verification               | Vitest, real PostgreSQL integration tests, Playwright                                  | Business rules, authorization, browser flows, and responsive checks             |
| Packaging                  | Docker Compose with a reverse proxy and HTTPS                                          | Portable local development and cloud deployment                                 |
| CI                         | GitHub Actions if GitHub is selected                                                   | Quality and security checks before release                                      |

Select current supported patched releases at implementation time; this document does not pin or audit packages.

Important implementation rules: use exact integer minor units or decimal database fields for money, never floating-point totals. Use database transactions and uniqueness constraints for stock allocation, receipts, and settlement. Revalidate cart prices and availability on the server. Separate reservation from sale, expire abandoned reservations, and prevent retrying an action from creating duplicate bills or stock deductions. Financial corrections should leave an audit trail.

## Hosting recommendation

For the lowest recurring cost with technician maintenance, evaluate a small paid VPS running the application and PostgreSQL, with encrypted backups stored away from that server. Hetzner is a candidate, not a selected provider. Check current regional price, availability, Sri Lanka latency, storage, and backup requirements before choosing a plan. A single VPS has a single-server failure risk and requires security updates, monitoring, and recovery ownership.

For lower database maintenance, evaluate a managed PostgreSQL provider. Supabase Pro currently starts at USD 25/month, before app hosting and applicable extras. Its database backups do not replace separate backup planning for uploaded files. Choose one authentication approach; do not add Supabase Auth alongside Better Auth without a reason.

The public storefront needs an internet-accessible service. A shop-only local installation cannot independently serve remote customers. Offline billing and receipt printing are required, with synchronization after reconnection. The local storage, synchronization, device topology, and stock-allocation architecture must be designed explicitly. A local shop service with a durable database is a candidate if multiple counters need to share stock while the internet is unavailable; it adds installation and maintenance work. A browser cache alone is insufficient.

Sources checked for this recommendation:

- Next.js self-hosting: https://nextjs.org/docs/app/guides/self-hosting
- Prisma transactions: https://www.prisma.io/docs/orm/fundamentals/transactions
- Better Auth: https://better-auth.com/docs/introduction
- Motion: https://motion.dev/docs/react-animation
- Supabase pricing: https://supabase.com/pricing
- Supabase backups: https://supabase.com/docs/guides/platform/backups
- Hetzner cloud: https://www.hetzner.com/cloud/

## Visual requirements

Use the supplied Dences logo. Preserve its existing geometry; complete a clean transparent PNG. Figma MCP is now connected, and the page structure plus catalogue, product-details, and checkout screens have been inspected. The kit uses white/charcoal surfaces, General Sans typography, gray borders, and rounded controls. The reviewed screens are 390 × 844 mobile layouts; desktop storefront and ERP layouts will adapt that visual system. Template and font licensing still need verification.

Use the reviewed commerce screens as the starting reference, adapt them to Dences products and manual ordering, and remove irrelevant payment-gateway and other unused screens. Use shared type, colour, spacing, radii, and components for the ERP, with denser task-focused layouts. Verify both desktop and mobile. Add light spring/bounce feedback for occasional storefront interactions; keep billing, tables, and frequent staff actions quick. Respect reduced-motion preferences and keep core flows usable without animation.

Skills requested: Secure Project CI, Impeccable, plus relevant frontend and animation guidance. The initial Impeccable setup issue was resolved in the frontend phase. PRODUCT.md, DESIGN.md, the branded storefront and review evidence now exist; see [verification](frontend-verification.md) for completed checks and the remaining visual recapture.

## Proposed security CI controls

Apply the Secure Project CI skill to the actual repository once initialized:

- Locked dependency installation, type checks, lint, build, and meaningful tests.
- Secret scanning of current content and committed history with redacted output.
- Dependency scanning covering runtime, development, and build tools.
- Container scanning covering builder and runtime images.
- Block High/Critical vulnerabilities by default; scanner errors and unavailable/stale advisory evidence must not silently pass.
- Pin Actions to verified commit SHAs and container images to verified digests; configure update automation.
- Unprivileged PR validation with no production credentials.
- A required aggregate check that rejects missing, failed, skipped, and cancelled prerequisites.
- Separate protected deployment that validates the exact release revision and artifact.
- Document hosted branch protection and environment settings separately; files alone cannot enable them.

Security-sensitive acceptance cases include concurrent attempts to sell the same device, duplicate payment acceptance, unauthorized cost/profit exports, private receipt access, malicious uploads, order price tampering, cancellation/refund accounting, backup restoration, and any approved offline resynchronization.

Frontend quality, dependency-audit and redacted secret-scan workflows are now prepared in `.github/`, and local checks have run. Hosted CI, repository rules, history scans and deployment enforcement have not run; no initialized repository is present. Frontend Dockerfiles, Compose configurations and container gates are now prepared; local image execution is unverified because of daemon permissions. Backend and release controls remain later work. See [frontend-security.md](frontend-security.md).

## Unresolved before the development plan

1. Offline billing is confirmed. Can one designated counter per shop bill offline, or must multiple devices do so? Define reserved stock ownership, offline bill numbering, durable local records, retry handling, and reconciliation. Online orders must not promise unavailable stock during a shop outage; the availability and confirmation policy needs explicit agreement.
2. Which contact channels, customer-account model, pickup/delivery rules, and delivery charges should the storefront use?
3. Can workers publish items immediately and adjust stock, or do those actions need owner approval?
4. Applicable template/font licence and final production logo asset. Figma access and initial frame review are complete.
5. A numerical monthly hosting ceiling and final hosting selection. The user has authorized continuing the plan with Dences branding. No provider or paid service has been purchased.
