# Planned domain boundaries

`catalogue`, `inventory`, `purchasing`, `sales`, `orders`, `payments`, `fulfilment`, `after-sales`, `consignment`, `finance`, `identity`, `audit` and `sync` will hold business rules when implemented. These are module boundaries within a modular application, not a requirement to create a service for every noun.

Keep database transactions and stock authority in this layer; route handlers and UI components should not independently duplicate financial/stock rules.
