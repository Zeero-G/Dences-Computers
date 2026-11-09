# Dences architecture

The customer frontend is implemented. The connected backend and ERP remain planned, following the user's frontend-first direction.

- [Current frontend](current-system.md)
- [Proposed connected system](target-system.md)
- [System and business-flow diagrams](../diagrams/README.md)
- [Docker operation](../../infra/docker/README.md)
- [Business requirements and build sequence](../development-plan.md)
- [Security pipeline](../frontend-security.md)

The agreed direction is modular TypeScript with Next.js as the web/server boundary, PostgreSQL for transactional data and private object storage for evidence. Creating the folders does not install those future services.
