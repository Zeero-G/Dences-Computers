# Implemented frontend

`frontend/src/app/` contains home, catalogue, product, saved items, cart, quotation, checkout and contact routes. Next.js exports pages to `frontend/out/`; React handles filtering and local request previews in the browser. Products are bundled sample data; changes currently require a rebuild.

`frontend/scripts/serve.mjs` serves exported files with clean routes, GET/HEAD and a public health check. It defaults to 0.0.0.0 for same-network phone access. It accepts no business API calls or uploads. The runtime container contains the export/server; its builder contains Node packages and build tools.

Cart/saved identifiers and quantities use validated localStorage. Customer details and receipt selections stay in page state. Image preview is not an upload. Text downloads and print/PDF produce previews, not issued business documents.

The existing General Sans, neutral palette, supplied logo, components and reduced-motion handling follow root DESIGN.md. This folder move does not redesign the interface. `frontend/DESIGN.md` links to the same design rules for the later ERP.

No business API, database, authentication, stock authority, financial ledger, hosting or offline billing service exists yet. `backend/src/modules/` and `packages/contracts/` reserve future boundaries. See the [diagrams](../diagrams/README.md).
