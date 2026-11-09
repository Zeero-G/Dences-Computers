import test from "node:test";
import assert from "node:assert/strict";
import { receiptError } from "../src/lib/receipt.ts";
test("receipt selection rejects disallowed types, empty files and oversized files", () => {
  assert.notEqual(
    receiptError({ type: "application/x-msdownload", size: 100 }),
    "",
  );
  assert.notEqual(receiptError({ type: "image/png", size: 0 }), "");
  assert.notEqual(
    receiptError({ type: "application/pdf", size: 5 * 1024 * 1024 + 1 }),
    "",
  );
  assert.equal(receiptError({ type: "image/jpeg", size: 12000 }), "");
  assert.equal(receiptError({ type: "application/pdf", size: 500000 }), "");
});
