"use client";
import Link from "next/link";
import {
  ArrowRight,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  FileText,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { useStore } from "./store-provider";
import { byId, money } from "@/lib/products";

export function CartPage() {
  const { cart, setQuantity } = useStore();
  const total = cart.reduce(
    (sum, line) => sum + (byId(line.id)?.price ?? 0) * line.quantity,
    0,
  );
  return (
    <div className="container cart-page">
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Your cart</span>
      </div>
      <div className="page-heading">
        <div>
          <h1>Your next upgrade.</h1>
          <p>
            {cart.length
              ? "Good choices. Let’s put them together."
              : "A little room for something good."}
          </p>
        </div>
      </div>
      {!cart.length ? (
        <div className="empty-state">
          <ShoppingBag size={44} strokeWidth={1.3} />
          <h2>Your cart is waiting.</h2>
          <p>Explore the collection and add something you like.</p>
          <Link className="button primary" href="/shop">
            Explore the collection <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((line) => {
              const p = byId(line.id)!;
              return (
                <article className="cart-item" key={p.id}>
                  <Link href={`/product/${p.id}`} className="cart-item-image">
                    <img
                      src={`/products/${p.image}`}
                      alt={p.name}
                      width="160"
                      height="150"
                    />
                  </Link>
                  <div className="cart-item-main">
                    <div className="product-meta">
                      {p.condition === "Used" ? "Pre-owned" : "New"} · {p.color}
                    </div>
                    <Link href={`/product/${p.id}`}>
                      <h2>{p.name}</h2>
                    </Link>
                    <p>{p.specs[0][1]}</p>
                    <div className="quantity-control">
                      <button
                        aria-label={`Decrease ${p.name} quantity`}
                        onClick={() => setQuantity(p.id, line.quantity - 1)}
                      >
                        <Minus size={15} />
                      </button>
                      <output aria-label={`${p.name} quantity`}>
                        {line.quantity}
                      </output>
                      <button
                        aria-label={`Increase ${p.name} quantity`}
                        disabled={line.quantity >= 10}
                        onClick={() => setQuantity(p.id, line.quantity + 1)}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-end">
                    <strong>{money(p.price * line.quantity)}</strong>
                    <button
                      className="remove-item"
                      onClick={() => setQuantity(p.id, 0)}
                      aria-label={`Remove ${p.name}`}
                    >
                      <Trash2 size={17} />
                      <span>Remove</span>
                    </button>
                  </div>
                </article>
              );
            })}
            <Link href="/shop" className="text-link">
              <ArrowLeft size={17} />
              Continue exploring
            </Link>
          </div>
          <aside className="order-summary">
            <h2>Your summary</h2>
            <div>
              <span>Items ({cart.reduce((s, p) => s + p.quantity, 0)})</span>
              <strong>{money(total)}</strong>
            </div>
            <div>
              <span>Delivery</span>
              <span>To be confirmed</span>
            </div>
            <div className="summary-total">
              <span>Estimated total</span>
              <strong>{money(total)}</strong>
            </div>
            <p>
              Sample prices. The shop confirms availability, delivery, and the
              final total.
            </p>
            <Link href="/checkout" className="button primary">
              Continue to order request <ArrowRight size={18} />
            </Link>
            <Link href="/quotation" className="button secondary">
              <FileText size={18} />
              Request a quotation
            </Link>
            <span className="summary-note">
              <ShieldCheck size={17} />
              No online payment is taken
            </span>
          </aside>
        </div>
      )}
    </div>
  );
}
