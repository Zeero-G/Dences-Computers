# Architecture and business diagrams

Only the first diagram is implemented. The remaining diagrams describe the proposed connected phase, not live APIs or services. Mermaid blocks render in compatible Markdown viewers; editable `.mmd` sources are alongside this file.

## Current frontend

[Mermaid source](current-system.mmd)

```mermaid
flowchart LR
  customer["Customer browser on phone or PC"] -->|"GET pages and assets"| preview["Static frontend server on port 3000"]
  preview --> exportFiles["Next.js exported pages and bundled demo products"]
  customer --> browserState["Local cart and saved items"]
  customer --> ephemeral["Temporary contact and receipt selection"]
  customer --> documents["Preview text download or print"]
```

## Proposed connected system

[Mermaid source](target-system.mmd)

```mermaid
flowchart TB
  customer["Customer storefront"] --> cloudWeb["Cloud Next.js web and API boundary"]
  staff["Protected owner and staff ERP"] --> cloudWeb
  cloudWeb --> modules["Shared TypeScript business modules"]
  modules --> cloudDb[("Cloud PostgreSQL and shop projections")]
  modules --> publicImages["Public product image storage"]
  modules --> evidence["Private evidence storage"]
  modules -->|"Allocation requests and acknowledgements"| computerHost["Computer shop stock authority"]
  modules -->|"Allocation requests and acknowledgements"| phoneHost["Phone shop stock authority"]
  computerTill["Computer shop tills and printer"] --> computerHost
  phoneTill["Phone shop tills and printer"] --> phoneHost
  computerHost --> computerDb[("Local PostgreSQL and durable outbox")]
  phoneHost --> phoneDb[("Local PostgreSQL and durable outbox")]
  computerHost -->|"Ordered idempotent events"| modules
  phoneHost -->|"Ordered idempotent events"| modules
```

## Proposed customer order flow

[Mermaid source](order-flow.mmd)

```mermaid
flowchart TD
  selection["Customer selects products"] --> request["Quotation or contact-order request"]
  request --> check["Staff checks final price and shop stock"]
  check --> stock{"Shop authority confirms allocation?"}
  stock -->|"No or offline"| pending["Pending availability confirmation"]
  pending --> check
  stock -->|"Yes"| instructions["Confirmed quotation and payment instructions"]
  instructions --> payment["Customer pays and may upload private receipt"]
  payment --> review["Owner or authorized worker checks actual payment"]
  review --> verified{"Full payment verified?"}
  verified -->|"No"| unresolved["Request correction or resolve exception"]
  unresolved --> review
  verified -->|"Yes"| accepted["Accept and prepare allocated order"]
  accepted --> delivery["Arrange delivery or pickup"]
  delivery --> handover["Record handover and completion"]
```

## Proposed offline billing and sync

[Mermaid source](offline-sync.mmd)

```mermaid
sequenceDiagram
  participant till as Shop till
  participant localHost as Shop authority
  participant localDb as Local PostgreSQL
  participant printer as Receipt printer
  participant cloud as Cloud application
  till->>localHost: Submit sale with unique operation ID
  localHost->>localDb: Transactionally save sale, payment, stock and outbox
  localDb-->>localHost: Committed bill and shop sequence
  localHost-->>till: Immutable bill snapshot
  till->>printer: Print receipt while internet is unavailable
  loop When connected, retry pending events
    localHost->>cloud: Send ordered event with operation ID
    cloud->>cloud: Deduplicate and commit projection atomically
    cloud-->>localHost: Acknowledge committed event
    localHost->>localDb: Mark event delivered
  end
```

Offline billing assumes the local host and LAN remain powered. Cloud requests cannot finalize stock allocation without the shop authority. Uploading a receipt does not mark payment verified. Printing or retrying synchronization must not create another sale.
