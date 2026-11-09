import { Suspense } from "react";
import { RequestForm } from "@/components/request-form";
export const metadata = { title: "Order request" };
export default function Checkout() {
  return (
    <Suspense
      fallback={
        <div className="container loading-state">Preparing your request…</div>
      }
    >
      <RequestForm kind="order" />
    </Suspense>
  );
}
