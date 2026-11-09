import test from "node:test";
import assert from "node:assert/strict";
import { normalizeCart, cartTotal } from "../src/lib/cart.ts";

test("untrusted browser cart data cannot create unknown, fractional or invalid quantities", () => {
  assert.deepEqual(
    normalizeCart(
      [
        { id: "phone", quantity: 2 },
        { id: "unknown", quantity: 1 },
        { id: "phone", quantity: -3 },
        { id: "laptop", quantity: 1.5 },
        { id: "laptop", quantity: "2" },
        null,
      ],
      ["phone", "laptop"],
    ),
    [{ id: "phone", quantity: 2 }],
  );
  assert.deepEqual(normalizeCart({ id: "phone" }, ["phone"]), []);
});
test("duplicate stored lines merge without bypassing the demonstration quantity cap", () => {
  assert.deepEqual(
    normalizeCart(
      [
        { id: "phone", quantity: 8 },
        { id: "phone", quantity: 9 },
      ],
      ["phone"],
    ),
    [{ id: "phone", quantity: 10 }],
  );
});
test("cart totals combine quantities without rounding integer LKR amounts", () => {
  assert.equal(
    cartTotal(
      [
        { id: "phone", quantity: 2 },
        { id: "adapter", quantity: 3 },
      ],
      { phone: 165000, adapter: 5500 },
    ),
    346500,
  );
  assert.equal(cartTotal([], {}), 0);
});
