"use client";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  ChevronRight,
  ShieldCheck,
  MessageCircle,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { money, products, type Product } from "@/lib/products";
import { useStore } from "./store-provider";
import { ProductCard } from "./product-card";

export function ProductDetail({ product: p }: { product: Product }) {
  const [image, setImage] = useState(p.image);
  const { saved, toggleSaved, add } = useStore();
  const isSaved = saved.includes(p.id);
  return (
    <div className="container detail-page">
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <ChevronRight size={13} />
        <Link href={`/shop?category=${p.category}`}>{p.category}</Link>
        <ChevronRight size={13} />
        <span>{p.name}</span>
      </div>
      <div className="product-detail-layout">
        <div className="detail-gallery">
          <div className="detail-main-image">
            <span
              className={`condition ${p.condition === "Used" ? "used" : ""}`}
            >
              {p.condition === "Used" ? "Pre-owned" : "Brand new"}
            </span>
            <img
              src={`/products/${image}`}
              alt={p.name}
              width="650"
              height="580"
            />
            <button
              className="save-button"
              aria-label={`${isSaved ? "Unsave" : "Save"} ${p.name}`}
              aria-pressed={isSaved}
              onClick={() => toggleSaved(p.id)}
            >
              <Heart fill={isSaved ? "currentColor" : "none"} size={21} />
            </button>
          </div>
          {(p.gallery?.length ?? 0) > 1 && (
            <div className="gallery-thumbnails" aria-label="Product images">
              {p.gallery!.map((src, i) => (
                <button
                  key={src}
                  className={image === src ? "selected" : ""}
                  onClick={() => setImage(src)}
                  aria-label={`View ${p.name} image ${i + 1}`}
                  aria-pressed={image === src}
                >
                  <img src={`/products/${src}`} alt="" width="90" height="80" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="detail-info">
          <div className="detail-brand">
            {p.brand} <span>·</span> {p.category}
          </div>
          <h1>{p.name}</h1>
          <p className="detail-description">{p.summary}</p>
          <div className="detail-price">
            <strong>{money(p.price)}</strong>
            <span>Sample price · Confirm with shop</span>
          </div>
          <div className="color-selection">
            <span>
              Colour <strong>{p.color}</strong>
            </span>
          </div>
          <dl className="quick-specs">
            {p.specs.map(([title, value]) => (
              <div key={title}>
                <dt>{title}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="detail-actions">
            <button className="button primary" onClick={() => add(p.id)}>
              <ShoppingBag size={19} />
              Add to cart
              <ArrowRight size={18} />
            </button>
            <Link
              className="button secondary"
              href={`/quotation?product=${p.id}`}
            >
              Request a quotation
            </Link>
          </div>
          <div className="detail-promises">
            <div>
              <ShieldCheck size={19} />
              <span>{p.warranty}</span>
            </div>
            <div>
              <Truck size={19} />
              <span>Delivery arranged after confirmation</span>
            </div>
            <div>
              <MessageCircle size={19} />
              <Link href={`/contact?product=${p.id}`}>
                Ask the shop about this item
              </Link>
            </div>
          </div>
          <p className="detail-disclaimer">
            Demonstration listing. The shop will confirm the exact
            configuration, condition, availability, and warranty before an order
            is accepted.
          </p>
        </div>
      </div>
      <section className="related-section">
        <div className="section-heading">
          <h2>A few more possibilities.</h2>
          <Link className="text-link" href="/shop">
            Explore all <ArrowRight size={18} />
          </Link>
        </div>
        <div className="product-grid">
          {products
            .filter((item) => item.id !== p.id)
            .sort(
              (a, b) =>
                Number(b.category === p.category) -
                Number(a.category === p.category),
            )
            .slice(0, 4)
            .map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
        </div>
      </section>
    </div>
  );
}
