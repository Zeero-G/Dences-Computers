import { Suspense } from "react";
import { RequestForm } from "@/components/request-form";
export const metadata = { title: "Request a quotation" };
export default function Quotation() {
  return (
    <Suspense
      fallback={
        <div className="container loading-state">Preparing your quotation…</div>
      }
    >
      <RequestForm kind="quotation" />
    </Suspense>
  );
}
