import { Suspense } from "react";
import { Catalogue } from "@/components/catalogue";
export const metadata = { title: "Explore the collection" };
export default function Shop() {
  return (
    <Suspense
      fallback={
        <div className="container loading-state">Loading the collection…</div>
      }
    >
      <Catalogue />
    </Suspense>
  );
}
