import { Suspense } from "react";
import { RequestForm } from "@/components/request-form";
export const metadata = { title: "Contact the shops" };
export default function Contact() {
  return (
    <>
      <Suspense
        fallback={<div className="container loading-state">Loading…</div>}
      >
        <RequestForm kind="contact" />
      </Suspense>
      <section className="container faq-section" id="questions">
        <h2>A few things to know.</h2>
        <div>
          {[
            [
              "Can I pay directly on this website?",
              "There is no card payment gateway. The planned ordering flow uses contact with the shop or bank-payment evidence that staff review. This preview does not take payments.",
            ],
            [
              "Can I ask for a quotation first?",
              "Yes. Select products or describe the setup you need, then create a quotation request. The shop will confirm actual specifications, availability, and pricing when the connected service is ready.",
            ],
            [
              "Do all products include a warranty?",
              "Warranty availability depends on the item and its condition. Ask the shop to confirm the terms for the specific device before buying.",
            ],
            [
              "How do delivery and pickup work?",
              "The shop will confirm delivery availability, charges, or the pickup location before accepting an order. Delivery rates and shop contact details have not been added to this preview.",
            ],
          ].map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
