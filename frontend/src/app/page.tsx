"use client";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Laptop,
  Smartphone,
  Headphones,
  MessageCircle,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default function HomePage() {
  const [category, setCategory] = useState("All products");
  const reduce = useReducedMotion();
  const selection = products
    .filter(
      (p) =>
        category === "All products" ||
        (category === "Pre-owned"
          ? p.condition === "Used"
          : p.category === category),
    )
    .slice(0, 4);
  return (
    <>
      <section className="container hero">
        <div className="hero-copy">
          <h1>
            A little upgrade.
            <br />
            <span>A whole lot more.</span>
          </h1>
          <p>
            Find the phone, laptop, or everyday essential
            <br className="desktop-br" /> that feels right for you.
          </p>
          <Link className="button primary" href="/shop">
            Explore the collection <ArrowRight size={19} />
          </Link>
          <div className="hero-foot">
            <span>New & pre-owned</span>
            <span className="small-dot" />
            <span>Computers & mobile</span>
          </div>
        </div>
        <div className="hero-visual">
          <span className="hero-word" aria-hidden="true">
            UPGRADE.
          </span>
          <motion.img
            src="/products/macbook.webp"
            alt="Sample MacBook Pro laptop"
            width="650"
            height="500"
            initial={false}
            animate={reduce ? {} : { y: [0, -7, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="hero-product-caption">
            <span>Make room for your next idea.</span>
            <Link
              href="/product/macbook-pro"
              aria-label="Explore the MacBook Pro"
            >
              <ArrowUpRight size={24} />
            </Link>
          </div>
        </div>
      </section>
      <section
        className="container category-strip"
        aria-label="Shop by category"
      >
        {[
          {
            name: "Laptops",
            label: "Computers & laptops",
            sub: "For work, play & everything between",
            icon: Laptop,
          },
          {
            name: "Phones",
            label: "Phones & mobiles",
            sub: "Find your everyday companion",
            icon: Smartphone,
          },
          {
            name: "Accessories",
            label: "The finishing touches",
            sub: "Good things for your setup",
            icon: Headphones,
          },
        ].map(({ name, label, sub, icon: Icon }) => (
          <Link href={`/shop?category=${name}`} key={name}>
            <span className="category-icon">
              <Icon size={25} strokeWidth={1.5} />
            </span>
            <span>
              <strong>{label}</strong>
              <small>{sub}</small>
            </span>
            <ArrowUpRight size={19} />
          </Link>
        ))}
      </section>
      <section className="container collection-section">
        <div className="section-heading">
          <div>
            <h2>Meet your next favourite.</h2>
            <p>A few possibilities for your next upgrade.</p>
          </div>
          <Link className="text-link" href="/shop">
            View all products <ArrowRight size={18} />
          </Link>
        </div>
        <div
          className="collection-tabs"
          role="group"
          aria-label="Filter featured products"
        >
          {[
            "All products",
            "Laptops",
            "Phones",
            "Accessories",
            "Pre-owned",
          ].map((c) => (
            <button
              key={c}
              className={category === c ? "selected" : ""}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="product-grid">
          {selection.map((p, index) => (
            <ProductCard key={p.id} product={p} index={index} />
          ))}
        </div>
        <p className="sample-caption">
          A look at what’s possible. These are sample listings; prices and
          availability will be confirmed by the shop.
        </p>
      </section>
      <section className="container split-feature">
        <div className="preowned-visual">
          <img
            src="/products/iphone-2.webp"
            alt="Sample pre-owned iPhone"
            width="520"
            height="420"
            loading="lazy"
          />
          <span>
            Another chapter.
            <br />
            Same great possibilities.
          </span>
        </div>
        <div className="preowned-copy">
          <h2>
            New to you.
            <br />
            Right for your budget.
          </h2>
          <p>
            Explore pre-owned phones and laptops. Ask us about the individual
            device’s condition, specifications, and available warranty before
            you decide.
          </p>
          <Link className="button primary" href="/shop?condition=Used">
            Discover pre-owned <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="container help-section">
        <div>
          <h2>Let’s find your fit.</h2>
          <p>
            Putting together a setup? Select a few items and
            <br className="desktop-br" /> ask the shop for a quotation.
          </p>
          <Link className="text-link" href="/quotation">
            Build a quotation request <ArrowRight size={19} />
          </Link>
        </div>
        <div className="help-steps">
          <div>
            <FileText size={23} strokeWidth={1.6} />
            <span>
              <h3>Choose your essentials</h3>
              <p>Add the devices and accessories you have in mind.</p>
            </span>
          </div>
          <div>
            <MessageCircle size={23} strokeWidth={1.6} />
            <span>
              <h3>Talk it through</h3>
              <p>The shop confirms the details, availability, and price.</p>
            </span>
          </div>
          <div>
            <ShieldCheck size={23} strokeWidth={1.6} />
            <span>
              <h3>Arrange your order</h3>
              <p>Confirm payment and delivery directly with the team.</p>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
