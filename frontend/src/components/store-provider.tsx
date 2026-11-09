"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/lib/products";
import { normalizeCart, type CartLine } from "@/lib/cart";

type Store = {
  cart: CartLine[];
  saved: string[];
  add: (id: string) => void;
  setQuantity: (id: string, n: number) => void;
  toggleSaved: (id: string) => void;
  notice: string;
  announce: (message: string) => void;
};
const Context = createContext<Store | null>(null);
export const useStore = () => {
  const value = useContext(Context);
  if (!value) throw new Error("Missing store provider");
  return value;
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    try {
      const ids = products.map((p) => p.id);
      setCart(
        normalizeCart(
          JSON.parse(localStorage.getItem("dences-cart-v1") ?? "[]"),
          ids,
        ),
      );
      const stored = JSON.parse(
        localStorage.getItem("dences-saved-v1") ?? "[]",
      );
      if (Array.isArray(stored))
        setSaved([
          ...new Set(
            stored.filter(
              (id): id is string => typeof id === "string" && ids.includes(id),
            ),
          ),
        ]);
    } catch {
      /* An invalid or unavailable browser store starts empty. */
    }
    setReady(true);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem("dences-cart-v1", JSON.stringify(cart));
        localStorage.setItem("dences-saved-v1", JSON.stringify(saved));
      } catch {
        /* The current session still works without persistence. */
      }
    }
  }, [cart, saved, ready]);
  function announce(message: string) {
    setNotice(message);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(""), 3200);
  }
  function add(id: string) {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setCart((previous) =>
      normalizeCart(
        [...previous, { id, quantity: 1 }],
        products.map((p) => p.id),
      ),
    );
    announce(`${product.name} added to your cart`);
  }
  function setQuantity(id: string, quantity: number) {
    setCart((previous) =>
      quantity < 1
        ? previous.filter((p) => p.id !== id)
        : normalizeCart(
            previous.map((p) => (p.id === id ? { ...p, quantity } : p)),
            products.map((p) => p.id),
          ),
    );
  }
  function toggleSaved(id: string) {
    setSaved((previous) =>
      previous.includes(id)
        ? previous.filter((p) => p !== id)
        : [...previous, id],
    );
  }
  return (
    <Context.Provider
      value={{ cart, saved, add, setQuantity, toggleSaved, notice, announce }}
    >
      {children}
    </Context.Provider>
  );
}
