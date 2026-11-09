# Backend boundaries

Read root AGENTS.md and docs/architecture/target-system.md. This is a scaffold, not a live service. Preserve the approved Node.js/TypeScript/Next.js, PostgreSQL/Prisma and Better Auth direction. Do not add framework packages, empty-success tests, placeholder authentication, fake payments or public database ports merely to make this directory runnable. Implement stock, financial and sync rules transactionally with meaningful integration tests when the user starts the backend phase. Never return purchase cost/profit fields to worker/customer APIs.
