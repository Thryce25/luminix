import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import FloatingBackground from "@/components/common/FloatingBackground";
import ScrollToTop from "@/components/common/ScrollToTop";
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

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.luminixclothing.com";

export const metadata: Metadata = {
  title: {
    default: "Luminix - Designed for the Fearless | Premium Dark Streetwear",
    template: "%s | Luminix",
  },
  description:
    "Designed for the Fearless. Embrace the Extraordinary. Where darkness meets elegance. Premium streetwear crafted for those who dare to stand out. Shop exclusive gothic fashion, dark aesthetic clothing, and alternative style pieces.",
  keywords: [
    "gothic fashion",
    "dark aesthetic",
    "gothic streetwear",
    "alternative fashion",
    "dark clothing",
    "gothic accessories",
    "premium gothic wear",
    "dark fashion brand",
    "gothic style clothing",
    "alternative streetwear",
    "gothic clothing online",
    "dark aesthetic fashion",
    "goth fashion store",
    "gothic apparel",
    "luminix clothing",
  ],
  authors: [{ name: "Luminix" }],
  creator: "Luminix",
  publisher: "Luminix",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Luminix",
    title: "Luminix - Designed for the Fearless | Premium Dark Streetwear",
    description:
      "Designed for the Fearless. Embrace the Extraordinary. Where darkness meets elegance. Premium streetwear crafted for those who dare to stand out.",
    images: [
      {
        url: `${BASE_URL}/images/White%20logo.png`,
        width: 600,
        height: 600,
        alt: "Luminix Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    site: "@luminix.wear",
    creator: "@luminix.wear",
    title: "Luminix - Designed for the Fearless | Premium Dark Streetwear",
    description: "Designed for the Fearless. Embrace the Extraordinary. Where darkness meets elegance. Premium streetwear crafted for those who dare to stand out.",
    images: [`${BASE_URL}/images/White%20logo.png`],
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
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: "piVD_9QAWaFtf9uws45FUo4Ln70EuG5VDH-MYOGFik0",
  },
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
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-YR4LRD7GFY"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YR4LRD7GFY');
            `,
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-black text-mist-lilac`}
      >
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <FloatingBackground />
        <ScrollToTop />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AnnouncementBar />
              <Header />
              <main className="min-h-screen pt-28 relative" style={{ zIndex: 10 }}>{children}</main>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
