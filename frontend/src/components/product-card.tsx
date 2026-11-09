"use client";
import Link from "next/link";
import { Heart, Plus, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { money, type Product } from "@/lib/products";
import { useStore } from "./store-provider";

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const { add, saved, toggleSaved } = useStore();
  const reduce = useReducedMotion();
  const isSaved = saved.includes(product.id);
  return (
    <motion.article
      className="product-card"
      initial={false}
      whileHover={reduce ? undefined : { y: -3 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
    >
      <div className="product-picture">
        <Link
          href={`/product/${product.id}`}
          aria-label={`View ${product.name}`}
        >
          <img
            src={`/products/${product.image}`}
            alt={product.name}
            width="350"
            height="280"
            loading={index < 4 ? "eager" : "lazy"}
          />
        </Link>
        <span
          className={`condition ${product.condition === "Used" ? "used" : ""}`}
        >
          {product.condition === "Used" ? "Pre-owned" : "New"}
        </span>
        <button
          className={`save-button ${isSaved ? "is-saved" : ""}`}
          aria-label={`${isSaved ? "Unsave" : "Save"} ${product.name}`}
          aria-pressed={isSaved}
          onClick={() => toggleSaved(product.id)}
        >
          <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
        <Link className="quick-view" href={`/product/${product.id}`}>
          Take a closer look <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="product-card-info">
        <div className="product-meta">
          <span>{product.brand}</span>
          <span>{product.color}</span>
        </div>
        <Link href={`/product/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>
        <p className="product-summary">
          {product.specs
            .slice(0, 2)
            .map((s) => s[1])
            .join(" · ")}
        </p>
        <div className="price-row">
          <strong>{money(product.price)}</strong>
          <button
            className="add-button"
            onClick={() => add(product.id)}
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
