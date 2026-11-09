import { Suspense } from "react";
import { Catalogue } from "@/components/catalogue";
export const metadata = { title: "Saved items" };
export default function Saved() {
  return (
    <Suspense
      fallback={
        <div className="container loading-state">Loading your shortlist…</div>
      }
    >
      <Catalogue savedOnly />
    </Suspense>
  );
}
