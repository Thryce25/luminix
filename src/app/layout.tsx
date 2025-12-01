import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Luminix | Gothic Fashion & Accessories",
    template: "%s | Luminix",
  },
  description:
    "Discover our curated collection of gothic-inspired fashion and accessories. Where elegance meets the extraordinary.",
  keywords: [
    "gothic fashion",
    "dark aesthetic",
    "gothic accessories",
    "alternative fashion",
    "dark clothing",
  ],
  openGraph: {
    title: "Luminix | Gothic Fashion & Accessories",
    description:
      "Discover our curated collection of gothic-inspired fashion and accessories.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-black text-mist-lilac`}
      >
        <CartProvider>
          <Header />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
