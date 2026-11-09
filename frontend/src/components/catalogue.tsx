"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X, ArrowRight, Heart } from "lucide-react";
import { products } from "@/lib/products";
import { ProductCard } from "./product-card";
import { useStore } from "./store-provider";
import { useRouter, useSearchParams } from "next/navigation";

export function Catalogue({ savedOnly = false }: { savedOnly?: boolean }) {
  const params = useSearchParams();
  const router = useRouter();
  const { saved } = useStore();
  const initialQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const category = params.get("category") ?? "All products";
  const condition = params.get("condition") ?? "All";
  const [brand, setBrand] = useState("All brands");
  const [sort, setSort] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(500000);
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);
  function updateFilter(key: string, value: string, empty: string) {
    const next = new URLSearchParams(params.toString());
    if (value === empty) next.delete(key);
    else next.set(key, value);
    if (query.trim()) next.set("q", query.trim());
    else next.delete("q");
    router.replace(
      `${savedOnly ? "/saved" : "/shop"}${next.size ? `?${next}` : ""}`,
      { scroll: false },
    );
  }
  const results = useMemo(() => {
    const data = products.filter(
      (p) =>
        (!savedOnly || saved.includes(p.id)) &&
        (category === "All products" || category === p.category) &&
        (condition === "All" || condition === p.condition) &&
        (brand === "All brands" || brand === p.brand) &&
        p.price <= maxPrice &&
        `${p.name} ${p.brand} ${p.category} ${p.specs.flat().join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase().trim()),
    );
    return sort === "low"
      ? data.sort((a, b) => a.price - b.price)
      : sort === "high"
        ? data.sort((a, b) => b.price - a.price)
        : sort === "name"
          ? data.sort((a, b) => a.name.localeCompare(b.name))
          : data;
  }, [savedOnly, saved, category, condition, brand, maxPrice, query, sort]);
  function reset() {
    setQuery("");
    router.replace(savedOnly ? "/saved" : "/shop", { scroll: false });
    setBrand("All brands");
    setMaxPrice(500000);
  }
  const active =
    category !== "All products" ||
    condition !== "All" ||
    brand !== "All brands" ||
    maxPrice < 500000 ||
    !!query;
  return (
    <div className="container catalogue-page">
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>{savedOnly ? "Saved items" : "The collection"}</span>
      </div>
      <div className="page-heading">
        <div>
          <h1>{savedOnly ? "Your shortlist." : "Find your next upgrade."}</h1>
          <p>
            {savedOnly
              ? "The things you’ve had your eye on, all in one place."
              : "Phones, laptops, and the good things that go with them."}
          </p>
        </div>
        <span className="item-count">
          {results.length} {results.length === 1 ? "product" : "products"}
        </span>
      </div>
      <div className="catalogue-toolbar">
        <div className="catalogue-search">
          <Search size={20} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the collection"
            aria-label="Search the collection"
          />
          {query && (
            <button aria-label="Clear search" onClick={() => setQuery("")}>
              <X size={17} />
            </button>
          )}
        </div>
        <button
          className="button secondary filters-toggle"
          onClick={() => setFiltersOpen(!filtersOpen)}
          aria-expanded={filtersOpen}
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
        <label className="sort-control">
          <span>Sort by</span>
          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </label>
      </div>
      <div className="catalogue-layout">
        <aside
          className={`filter-sidebar ${filtersOpen ? "filters-open" : ""}`}
          aria-label="Product filters"
        >
          <div className="filter-heading">
            <h2>Filters</h2>
            {active && (
              <button className="subtle-link" onClick={reset}>
                Reset all
              </button>
            )}
          </div>
          <fieldset>
            <legend>Categories</legend>
            {["All products", "Laptops", "Phones", "Accessories"].map((c) => (
              <label key={c} className="filter-option">
                <input
                  type="radio"
                  name="category"
                  checked={category === c}
                  onChange={() => updateFilter("category", c, "All products")}
                />
                <span>{c}</span>
                <small>
                  {c === "All products"
                    ? products.length
                    : products.filter((p) => p.category === c).length}
                </small>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Condition</legend>
            {["All", "New", "Used"].map((c) => (
              <label key={c} className="filter-option">
                <input
                  type="radio"
                  name="condition"
                  checked={condition === c}
                  onChange={() => updateFilter("condition", c, "All")}
                />
                <span>
                  {c === "All"
                    ? "All conditions"
                    : c === "Used"
                      ? "Pre-owned"
                      : "Brand new"}
                </span>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Brand</legend>
            <select
              aria-label="Filter by brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            >
              {["All brands", ...new Set(products.map((p) => p.brand))].map(
                (b) => (
                  <option key={b}>{b}</option>
                ),
              )}
            </select>
          </fieldset>
          <fieldset>
            <legend>Maximum price</legend>
            <input
              className="price-range"
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              aria-label="Maximum price in LKR"
            />
            <div className="range-label">
              <span>LKR 10,000</span>
              <strong>LKR {maxPrice.toLocaleString("en-LK")}</strong>
            </div>
          </fieldset>
          <div className="filter-help">
            <h3>Not quite sure?</h3>
            <p>
              Tell us what you’re looking for. We’ll help you narrow it down.
            </p>
            <Link href="/quotation">
              Request a quotation <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
        <section className="catalogue-results" aria-label="Products">
          <div
            className="collection-tabs category-chips"
            role="group"
            aria-label="Categories"
          >
            {["All products", "Laptops", "Phones", "Accessories"].map((c) => (
              <button
                aria-pressed={category === c}
                className={category === c ? "selected" : ""}
                key={c}
                onClick={() => updateFilter("category", c, "All products")}
              >
                {c}
              </button>
            ))}
          </div>
          <div aria-live="polite" className="sr-only">
            {results.length} {results.length === 1 ? "product" : "products"}{" "}
            found
          </div>
          {results.length ? (
            <div className="product-grid catalogue-grid">
              {results.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              {savedOnly ? (
                <Heart size={38} strokeWidth={1.3} />
              ) : (
                <Search size={38} strokeWidth={1.3} />
              )}
              <h2>
                {savedOnly && !saved.length
                  ? "Keep your favourites close."
                  : "Nothing here just yet."}
              </h2>
              <p>
                {savedOnly && !saved.length
                  ? "Tap the heart on any product to save it here."
                  : "Try a different search or clear your filters."}
              </p>
              {savedOnly && !saved.length ? (
                <Link href="/shop" className="button primary">
                  Explore products <ArrowRight size={18} />
                </Link>
              ) : (
                <button className="button primary" onClick={reset}>
                  Clear filters
                </button>
              )}
            </div>
          )}
          <p className="sample-caption">
            Demo catalogue. Specifications and LKR prices are illustrative.
            Confirm the exact item with the shop.
          </p>
        </section>
      </div>
    </div>
  );
}
