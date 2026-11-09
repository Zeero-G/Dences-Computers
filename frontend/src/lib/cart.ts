export type CartLine = { id: string; quantity: number };
export function normalizeCart(
  value: unknown,
  allowedIds: string[],
): CartLine[] {
  if (!Array.isArray(value)) return [];
  const result = new Map<string, number>();
  for (const line of value) {
    if (
      line &&
      typeof line.id === "string" &&
      allowedIds.includes(line.id) &&
      Number.isInteger(line.quantity) &&
      line.quantity > 0
    ) {
      result.set(
        line.id,
        Math.min(10, (result.get(line.id) ?? 0) + line.quantity),
      );
    }
  }
  return Array.from(result, ([id, quantity]) => ({ id, quantity }));
}
export function cartTotal(
  lines: CartLine[],
  prices: Record<string, number>,
): number {
  return lines.reduce(
    (sum, line) => sum + (prices[line.id] ?? 0) * line.quantity,
    0,
  );
}
