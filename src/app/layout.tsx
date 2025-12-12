import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import FloatingBackground from "@/components/common/FloatingBackground";
import { generateOrganizationJsonLd, generateWebsiteJsonLd, JsonLd } from "@/lib/structured-data";

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

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://luminixclothing.com";

export const metadata: Metadata = {
  title: {
    default: "Luminix",
    template: "%s",
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
    title: "Luminix",
    description:
      "Discover our curated collection of gothic-inspired fashion and accessories.",
    type: "website",
    siteName: "Luminix",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luminix",
    description: "Discover our curated collection of gothic-inspired fashion and accessories.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL(BASE_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = generateOrganizationJsonLd();
  const websiteJsonLd = generateWebsiteJsonLd(BASE_URL);

  return (
    <html lang="en" className="dark">
      <head>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-black text-mist-lilac`}
      >
        <FloatingBackground />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Header />
              <main className="min-h-screen pt-20 relative" style={{ zIndex: 10 }}>{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
