export type Category = "Laptops" | "Phones" | "Accessories";
export type Product = {
  id: string;
  name: string;
  brand: string;
  category: Category;
  condition: "New" | "Used";
  price: number;
  image: string;
  gallery?: string[];
  summary: string;
  specs: [string, string][];
  color: string;
  warranty: string;
  featured?: boolean;
};

// Demonstration catalogue only. Prices, configurations and warranties are illustrative.
export const products: Product[] = [
  {
    id: "macbook-pro",
    name: "MacBook Pro 14-inch",
    brand: "Apple",
    category: "Laptops",
    condition: "New",
    price: 425000,
    image: "macbook.webp",
    gallery: ["macbook.webp", "macbook-2.webp"],
    summary:
      "A creative workspace you can take anywhere. A vivid display, a comfortable keyboard, and room for your next big idea.",
    specs: [
      ["Processor", "Apple M1 Pro"],
      ["Memory", "16 GB unified memory"],
      ["Storage", "512 GB SSD"],
      ["Display", "14.2-inch Liquid Retina XDR"],
    ],
    color: "Space Grey",
    warranty: "Confirm warranty with the shop",
    featured: true,
  },
  {
    id: "iphone-13-pro",
    name: "iPhone 13 Pro",
    brand: "Apple",
    category: "Phones",
    condition: "Used",
    price: 165000,
    image: "iphone.webp",
    gallery: ["iphone.webp", "iphone-2.webp"],
    summary:
      "A familiar favourite with a brilliant display and a versatile camera system. Ask the shop for the individual device’s condition and battery details.",
    specs: [
      ["Processor", "Apple A15 Bionic"],
      ["Storage", "128 GB"],
      ["Display", "6.1-inch Super Retina XDR"],
      ["Condition", "Used · inspection details on request"],
    ],
    color: "Sierra Blue",
    warranty: "Confirm warranty with the shop",
    featured: true,
  },
  {
    id: "asus-zenbook",
    name: "ASUS Zenbook Pro Duo",
    brand: "ASUS",
    category: "Laptops",
    condition: "New",
    price: 389000,
    image: "asus.webp",
    summary:
      "More space for the way you work. A dual-screen laptop for switching between creative projects and everyday tasks.",
    specs: [
      ["Processor", "Intel Core i7"],
      ["Memory", "16 GB"],
      ["Storage", "1 TB SSD"],
      ["Display", "Dual-screen configuration"],
    ],
    color: "Celestial Blue",
    warranty: "Confirm warranty with the shop",
    featured: true,
  },
  {
    id: "samsung-s10",
    name: "Samsung Galaxy S10",
    brand: "Samsung",
    category: "Phones",
    condition: "Used",
    price: 68000,
    image: "samsung.webp",
    summary:
      "An everyday Android companion. Explore the specification, then contact the mobile shop for the individual device details.",
    specs: [
      ["Storage", "128 GB"],
      ["Memory", "8 GB"],
      ["Display", "6.1-inch Dynamic AMOLED"],
      ["Condition", "Used · inspection details on request"],
    ],
    color: "Prism Black",
    warranty: "Confirm warranty with the shop",
    featured: true,
  },
  {
    id: "dell-xps",
    name: "Dell XPS 13",
    brand: "Dell",
    category: "Laptops",
    condition: "Used",
    price: 185000,
    image: "dell.webp",
    summary:
      "A compact laptop for work, study, and everything between. Contact the computer shop to confirm the exact configuration.",
    specs: [
      ["Processor", "Intel Core i7"],
      ["Memory", "16 GB"],
      ["Storage", "512 GB SSD"],
      ["Display", "13.4-inch"],
    ],
    color: "Platinum Silver",
    warranty: "Confirm warranty with the shop",
  },
  {
    id: "lenovo-yoga",
    name: "Lenovo Yoga 920",
    brand: "Lenovo",
    category: "Laptops",
    condition: "Used",
    price: 145000,
    image: "lenovo.webp",
    summary:
      "From laptop to tablet, with a flexible design for work and ideas on the move. Ask about the condition of available units.",
    specs: [
      ["Processor", "Intel Core i7"],
      ["Memory", "16 GB"],
      ["Storage", "512 GB SSD"],
      ["Design", "Convertible touchscreen"],
    ],
    color: "Platinum",
    warranty: "Confirm warranty with the shop",
  },
  {
    id: "wireless-earbuds",
    name: "Apple AirPods",
    brand: "Apple",
    category: "Accessories",
    condition: "New",
    price: 8500,
    image: "earbuds.webp",
    summary:
      "An easy addition to your everyday setup. This sample listing shows how accessories will appear in the catalogue.",
    specs: [
      ["Connection", "Bluetooth"],
      ["Type", "In-ear wireless"],
      ["Included", "Charging case"],
      ["Compatibility", "Confirm with the shop"],
    ],
    color: "White",
    warranty: "Confirm warranty with the shop",
  },
  {
    id: "phone-charger",
    name: "MagSafe Battery Pack",
    brand: "Apple",
    category: "Accessories",
    condition: "New",
    price: 5500,
    image: "charger.webp",
    summary:
      "A compact backup for compatible iPhones. Confirm compatibility and the included accessories with the shop before ordering.",
    specs: [
      ["Connection", "MagSafe"],
      ["Use", "Portable phone charging"],
      ["Cable", "Confirm inclusion with the shop"],
      ["Compatibility", "Compatible iPhones only"],
    ],
    color: "White",
    warranty: "Confirm warranty with the shop",
  },
];

export const money = (amount: number) =>
  `LKR ${new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 }).format(amount)}`;
export const byId = (id: string) => products.find((p) => p.id === id);
