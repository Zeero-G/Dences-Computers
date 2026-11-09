"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  ArrowRight,
  Heart,
  ShoppingBag,
  Search,
  Menu,
  X,
  Laptop,
  Smartphone,
  Headphones,
  FileText,
  Check,
  Home,
  Package,
} from "lucide-react";
import { Suspense, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useStore } from "./store-provider";

const nav = [
  { name: "Discover", href: "/" },
  { name: "Laptops", href: "/shop?category=Laptops" },
  { name: "Phones", href: "/shop?category=Phones" },
  { name: "Accessories", href: "/shop?category=Accessories" },
  { name: "Pre-owned", href: "/shop?condition=Used" },
];

function ActiveNavigation() {
  const path = usePathname();
  const params = useSearchParams();
  const selected =
    path === "/"
      ? "Discover"
      : path === "/shop"
        ? params.get("condition") === "Used"
          ? "Pre-owned"
          : params.get("category")
        : null;
  return nav.map((n) => (
    <Link
      key={n.name}
      className={selected === n.name ? "active" : ""}
      aria-current={selected === n.name ? "page" : undefined}
      href={n.href}
    >
      {n.name}
    </Link>
  ));
}

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      className={`brand ${inverse ? "brand-inverse" : ""}`}
      href="/"
      aria-label="Dences Computers & Mobile home"
    >
      <span className="brand-symbol">
        <img src="/brand/dences-original.jpg" alt="" width="42" height="42" />
      </span>
      <span className="brand-type">
        DENCES<span>COMPUTERS & MOBILE</span>
      </span>
    </Link>
  );
}

export function SiteHeader() {
  const { cart, saved } = useStore();
  const [menu, setMenu] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const count = cart.reduce((sum, p) => sum + p.quantity, 0);
  function search(e: FormEvent) {
    e.preventDefault();
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    setMenu(false);
  }
  return (
    <>
      <div className="preview-banner">
        Frontend preview <span>·</span> Sample products & prices. Orders are not
        sent.
      </div>
      <header className="site-header">
        <div className="container header-main">
          <Brand />
          <form className="header-search" role="search" onSubmit={search}>
            <Search size={19} />
            <input
              aria-label="Search products"
              placeholder="Search your next upgrade…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <kbd>↵</kbd>
          </form>
          <div className="header-actions">
            <Link
              className="icon-button saved-header"
              href="/saved"
              aria-label={`Saved items, ${saved.length}`}
            >
              <Heart size={21} />
              {saved.length > 0 && (
                <span className="count-dot">{saved.length}</span>
              )}
            </Link>
            <Link
              className="cart-link"
              href="/cart"
              aria-label={`Shopping cart, ${count} items`}
            >
              <ShoppingBag size={21} />
              <span>My cart</span>
              <b>{count}</b>
            </Link>
            <button
              className="icon-button mobile-menu-toggle"
              aria-expanded={menu}
              aria-label={menu ? "Close menu" : "Open menu"}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <div className="navigation-wrap">
          <div className="container navigation-inner">
            <nav aria-label="Main navigation">
              <Suspense
                fallback={nav.map((n) => (
                  <Link key={n.name} href={n.href}>
                    {n.name}
                  </Link>
                ))}
              >
                <ActiveNavigation />
              </Suspense>
            </nav>
            <Link href="/quotation" className="quote-nav">
              Need a quotation? <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <AnimatePresence>
          {menu && (
            <motion.div
              className="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <form onSubmit={search} role="search">
                <Search size={20} />
                <input
                  aria-label="Search products on mobile"
                  placeholder="Search products…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" aria-label="Search">
                  <ArrowRight size={20} />
                </button>
              </form>
              <nav>
                {nav.map((n) => (
                  <Link
                    key={n.name}
                    href={n.href}
                    onClick={() => setMenu(false)}
                  >
                    {n.name}
                    <ArrowUpRight size={18} />
                  </Link>
                ))}
                <Link href="/quotation" onClick={() => setMenu(false)}>
                  Request a quotation
                  <FileText size={18} />
                </Link>
                <Link href="/contact" onClick={() => setMenu(false)}>
                  Contact the shops
                  <ArrowUpRight size={18} />
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Brand inverse />
            <p>
              Your next device.
              <br />
              Your kind of upgrade.
            </p>
          </div>
          <div className="footer-column">
            <h3>Explore</h3>
            <Link href="/shop?category=Laptops">Laptops & computers</Link>
            <Link href="/shop?category=Phones">Mobile phones</Link>
            <Link href="/shop?category=Accessories">Accessories</Link>
            <Link href="/shop?condition=Used">Pre-owned devices</Link>
          </div>
          <div className="footer-column">
            <h3>Here to help</h3>
            <Link href="/quotation">Request a quotation</Link>
            <Link href="/contact">Contact the shops</Link>
            <Link href="/cart">Your shopping cart</Link>
            <Link href="/contact#questions">Ordering & payment</Link>
          </div>
          <div className="footer-note">
            <p>
              Two shops.
              <br />
              One Dences.
            </p>
            <span>
              Computers & Mobile · Sri Lanka
              <br />
              Prices displayed in LKR
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Dences Computers & Mobile</span>
          <span>Demo catalogue · Availability confirmed by the shop</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

export function Toast() {
  const { notice } = useStore();
  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {notice && (
          <motion.div
            className="toast"
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 15, opacity: 0 }}
          >
            <Check size={19} />
            {notice}
            <Link href="/cart">
              View cart <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MobileNavigation() {
  const path = usePathname();
  const { cart } = useStore();
  return (
    <nav className="mobile-bottom" aria-label="Mobile navigation">
      {[
        { href: "/", title: "Home", icon: Home },
        { href: "/shop", title: "Explore", icon: Search },
        { href: "/saved", title: "Saved", icon: Heart },
        { href: "/cart", title: "Cart", icon: ShoppingBag },
        { href: "/contact", title: "Contact", icon: Package },
      ].map(({ href, title, icon: Icon }) => (
        <Link className={path === href ? "active" : ""} key={href} href={href}>
          <span>
            <Icon size={21} />
            {href === "/cart" && cart.length > 0 && <i />}
          </span>
          {title}
        </Link>
      ))}
    </nav>
  );
}

export const categories = [
  { name: "Laptops", description: "Work. Create. Play.", icon: Laptop },
  { name: "Phones", description: "Your everyday companion.", icon: Smartphone },
  {
    name: "Accessories",
    description: "Complete your setup.",
    icon: Headphones,
  },
];
