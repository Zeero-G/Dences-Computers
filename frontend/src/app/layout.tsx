import type { Metadata } from "next";
import { StoreProvider } from "@/components/store-provider";
import {
  SiteHeader,
  SiteFooter,
  Toast,
  MobileNavigation,
} from "@/components/layout";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Dences — Computers & Mobile", template: "%s | Dences" },
  description:
    "Explore phones, laptops and accessories at Dences Computers & Mobile. Frontend demonstration catalogue.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body id="top">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <StoreProvider>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <Toast />
          <MobileNavigation />
        </StoreProvider>
      </body>
    </html>
  );
}
