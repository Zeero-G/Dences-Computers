"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  FileText,
  Upload,
  X,
  ShoppingBag,
  Info,
  Printer,
} from "lucide-react";
import { useStore } from "./store-provider";
import { byId, money } from "@/lib/products";
import { receiptError } from "@/lib/receipt";

type Kind = "order" | "quotation" | "contact";
export function RequestForm({ kind }: { kind: Kind }) {
  const { cart } = useStore();
  const params = useSearchParams();
  const product = byId(params.get("product") ?? "");
  const lines = product ? [{ id: product.id, quantity: 1 }] : cart;
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [delivery, setDelivery] = useState("Delivery");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [preview, setPreview] = useState("");
  const [document, setDocument] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setReceiptUrl("");
      return;
    }
    const url = URL.createObjectURL(file);
    setReceiptUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const total = lines.reduce((s, p) => s + byId(p.id)!.price * p.quantity, 0);
  const title =
    kind === "order"
      ? "Let’s arrange your order."
      : kind === "quotation"
        ? "A setup that suits you."
        : "Let’s talk tech.";
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (fileError) return;
    const data = new FormData(e.currentTarget);
    setDraft(
      Object.fromEntries(
        ["name", "phone", "email", "address", "reference", "message"].map(
          (key) => [key, String(data.get(key) ?? "")],
        ),
      ),
    );
    const text = [
      "DENCES COMPUTERS & MOBILE",
      `${kind === "order" ? "ORDER" : kind === "quotation" ? "QUOTATION" : "CONTACT"} REQUEST — FRONTEND PREVIEW`,
      "This request has not been sent. Sample prices are not a confirmed quotation.",
      "",
      `Name: ${data.get("name")}`,
      `Phone: ${data.get("phone")}`,
      `Email: ${data.get("email") || "Not supplied"}`,
      kind === "order"
        ? `Handover: ${delivery}\nAddress: ${data.get("address") || "Not supplied"}`
        : "",
      "",
      ...lines.map(
        (l) =>
          `${l.quantity} × ${byId(l.id)!.name} — ${money(byId(l.id)!.price * l.quantity)} (sample)`,
      ),
      lines.length
        ? `Estimated item total: ${money(total)}`
        : "No catalogue items selected.",
      "Delivery charges and final prices must be confirmed with the shop.",
      "",
      `Message: ${data.get("message") || "None"}`,
      kind === "order"
        ? `Payment reference: ${data.get("reference") || "Not supplied"}\nReceipt filename: ${file?.name ?? "Not supplied"}\nNo file was uploaded or attached to this text request. Receipt verification is required before payment acceptance.`
        : "",
      "",
      "Contact the shop to confirm stock, configuration, condition, warranty and payment instructions.",
    ]
      .filter(Boolean)
      .join("\n");
    setDocument(text);
    setPreview(String(data.get("name")));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([document], { type: "text/plain;charset=utf-8" }),
    );
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `dences-${kind}-request.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  if (preview)
    return (
      <div className="container request-success">
        <CheckCircle2 size={56} strokeWidth={1.3} />
        <h1>Your request preview is ready.</h1>
        <p>
          Thanks, {preview}. You can review and download your request below.
        </p>
        <div className="honest-notice">
          <Info size={20} />
          <span>
            This is a frontend demonstration. Nothing has been sent to Dences,
            no payment has been verified, and no stock is reserved.
          </span>
        </div>
        <pre className="request-document">{document}</pre>
        <div className="success-actions">
          <button className="button primary" onClick={download}>
            <Download size={18} />
            Download request
          </button>
          <button className="button secondary" onClick={() => window.print()}>
            <Printer size={18} />
            Print / save as PDF
          </button>
          <button className="text-link" onClick={() => setPreview("")}>
            <ArrowLeft size={17} />
            Edit request
          </button>
        </div>
      </div>
    );
  if (kind === "order" && !lines.length)
    return (
      <div className="container empty-state">
        <ShoppingBag size={44} strokeWidth={1.3} />
        <h1>Start with something you like.</h1>
        <p>Add a product to your cart before creating an order request.</p>
        <Link className="button primary" href="/shop">
          Explore the collection <ArrowRight size={18} />
        </Link>
      </div>
    );
  return (
    <div className="container request-page">
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>
          {kind === "order"
            ? "Order request"
            : kind === "quotation"
              ? "Request a quotation"
              : "Contact the shops"}
        </span>
      </div>
      <div className="page-heading">
        <div>
          <h1>{title}</h1>
          <p>
            {kind === "order"
              ? "A few details to bring your choices together."
              : kind === "quotation"
                ? "Choose your items, share your needs, and put a request together."
                : "A question about a device, a setup, or your next upgrade?"}
          </p>
        </div>
      </div>
      <div className="request-layout">
        <form className="request-form" onSubmit={submit}>
          <section>
            <h2>Your details</h2>
            <div className="form-grid">
              <label>
                Full name <span>*</span>
                <input
                  name="name"
                  defaultValue={draft.name ?? ""}
                  autoComplete="name"
                  required
                  maxLength={100}
                  placeholder="Your full name"
                />
              </label>
              <label>
                Phone number <span>*</span>
                <input
                  name="phone"
                  defaultValue={draft.phone ?? ""}
                  type="tel"
                  autoComplete="tel"
                  required
                  pattern="[+0-9 ()\-]{7,22}"
                  title="Enter a phone number with 7–22 characters, using digits, spaces, +, - or parentheses."
                  placeholder="07X XXX XXXX"
                />
              </label>
              <label className="full-width">
                Email <small>(optional)</small>
                <input
                  name="email"
                  defaultValue={draft.email ?? ""}
                  type="email"
                  autoComplete="email"
                  maxLength={150}
                  placeholder="you@example.com"
                />
              </label>
            </div>
          </section>
          {kind === "order" && (
            <>
              <section>
                <h2>How would you like to receive it?</h2>
                <div className="delivery-options">
                  {["Delivery", "Shop pickup"].map((d) => (
                    <label className={delivery === d ? "selected" : ""} key={d}>
                      <input
                        type="radio"
                        name="delivery"
                        checked={delivery === d}
                        onChange={() => setDelivery(d)}
                      />
                      {d}
                      {delivery === d && <Check size={17} />}
                    </label>
                  ))}
                </div>
                {delivery === "Delivery" ? (
                  <label>
                    Delivery address <span>*</span>
                    <textarea
                      name="address"
                      defaultValue={draft.address ?? ""}
                      autoComplete="street-address"
                      required
                      rows={3}
                      maxLength={500}
                      placeholder="Street address, city, and postal code"
                    />
                  </label>
                ) : (
                  <p className="field-help">
                    The team will confirm which shop your order can be collected
                    from.
                  </p>
                )}
              </section>
              <section>
                <h2>Payment details</h2>
                <p className="form-intro">
                  The shop will confirm stock, the final price, and bank details
                  before payment. If you already have a payment receipt, you can
                  preview it here.
                </p>
                <label>
                  Transaction / trace number <small>(optional)</small>
                  <input
                    name="reference"
                    defaultValue={draft.reference ?? ""}
                    maxLength={100}
                    placeholder="Your bank transfer reference"
                  />
                </label>
                <div className="receipt-upload">
                  <label className="upload-target">
                    <Upload size={24} strokeWidth={1.5} />
                    <strong>
                      {file
                        ? "Choose a different receipt"
                        : "Choose a payment receipt"}
                    </strong>
                    <span>JPG, PNG, WebP, or PDF · Up to 5 MB</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      aria-label="Choose payment receipt for local preview"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setFileError("");
                        setFile(null);
                        if (!f) return;
                        const error = receiptError(f);
                        if (error) {
                          setFileError(error);
                          e.target.value = "";
                        } else setFile(f);
                      }}
                    />
                  </label>
                  {fileError && (
                    <p role="alert" className="form-error">
                      {fileError}
                    </p>
                  )}
                  {file && (
                    <div className="receipt-file">
                      {receiptUrl ? (
                        <img
                          src={receiptUrl}
                          alt="Your selected receipt preview"
                          width="56"
                          height="64"
                        />
                      ) : (
                        <FileText size={28} />
                      )}
                      <span>
                        <strong>{file.name}</strong>
                        <small>
                          {(file.size / 1024).toFixed(0)} KB · Selected locally
                        </small>
                      </span>
                      <button
                        type="button"
                        aria-label="Remove receipt"
                        onClick={() => setFile(null)}
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                  <p className="field-help">
                    Local preview only. The file is not uploaded, stored, or
                    included in the downloaded text request.
                  </p>
                </div>
              </section>
            </>
          )}
          <section>
            <h2>
              {kind === "quotation"
                ? "Tell us what you have in mind"
                : "Anything else?"}
            </h2>
            <label>
              {kind === "quotation" ? "Your requirements" : "Your message"}
              {kind !== "order" ? <span> *</span> : <small> (optional)</small>}
              <textarea
                name="message"
                defaultValue={draft.message ?? ""}
                required={kind !== "order"}
                rows={4}
                maxLength={2000}
                placeholder={
                  kind === "quotation"
                    ? "Your budget, preferred specs, what you’ll use it for, or anything you’d like us to include…"
                    : "Ask a question or add a note for the shop…"
                }
              />
            </label>
          </section>
          <div className="honest-notice">
            <Info size={19} />
            <span>
              Preview only. You’ll be able to download your request; it won’t be
              sent to the shop.
            </span>
          </div>
          <button className="button primary submit-request" type="submit">
            Preview{" "}
            {kind === "order"
              ? "order"
              : kind === "quotation"
                ? "quotation"
                : "contact"}{" "}
            request <ArrowRight size={18} />
          </button>
        </form>
        <aside className="request-summary order-summary">
          <h2>
            {lines.length ? "Your selected items" : "Two shops. One team."}
          </h2>
          {lines.length ? (
            <>
              <div className="request-items">
                {lines.map((l) => {
                  const p = byId(l.id)!;
                  return (
                    <div key={p.id}>
                      <img
                        src={`/products/${p.image}`}
                        alt={p.name}
                        width="65"
                        height="65"
                      />
                      <span>
                        <strong>{p.name}</strong>
                        <small>
                          Qty {l.quantity} · {money(p.price)}
                        </small>
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="summary-total">
                <span>Estimated items</span>
                <strong>{money(total)}</strong>
              </div>
              <p>
                Sample prices. Delivery, availability, and final totals need
                shop confirmation.
              </p>
              <Link href="/cart" className="text-link">
                Edit your selection <ArrowRight size={16} />
              </Link>
            </>
          ) : (
            <>
              <p>
                Computers, laptops, and upgrades at the computer shop. Phones
                and mobile essentials at the mobile shop.
              </p>
              <Link href="/shop" className="text-link">
                Explore the collection <ArrowRight size={17} />
              </Link>
            </>
          )}
          <div className="request-process">
            <h3>What happens next?</h3>
            <p>
              <Check size={16} />
              The shop checks your requirements
            </p>
            <p>
              <Check size={16} />
              Availability and pricing are confirmed
            </p>
            <p>
              <Check size={16} />
              Payment and handover are arranged
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
