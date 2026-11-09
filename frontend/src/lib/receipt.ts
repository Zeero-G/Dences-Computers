export function receiptError(file: { type: string; size: number }): string {
  const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (
    !allowed.includes(file.type) ||
    file.size <= 0 ||
    file.size > 5 * 1024 * 1024
  ) {
    return "Choose a non-empty JPG, PNG, WebP, or PDF no larger than 5 MB.";
  }
  return "";
}
