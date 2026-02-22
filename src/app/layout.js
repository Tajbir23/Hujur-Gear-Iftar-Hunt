import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ramadan-radar.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "রমাদান রাডার 🌙 | ইফতার খুঁজুন ও তারাবি ট্র্যাক করুন",
    template: "%s | রমাদান রাডার 🌙",
  },
  description:
    "কমিউনিটি-চালিত রমাদান অ্যাপ। কাছাকাছি মসজিদে ইফতারের মেনু খুঁজুন এবং সবচেয়ে দ্রুত তারাবি নামাজ ট্র্যাক করুন। রেজিস্ট্রেশন লাগবে না।",
  keywords: [
    "রমাদান", "ইফতার", "তারাবি", "মসজিদ", "নামাজ", "বাংলাদেশ",
    "Ramadan", "Iftar", "Tarabi", "Taraweeh", "Mosque", "Bangladesh",
    "ইফতার মেনু", "তারাবির সময়", "রকেট হুজুর", "ইফতার ক্র্যাশ",
    "nearby mosque", "iftar near me", "fastest taraweeh",
  ],
  authors: [{ name: "Ramadan Radar Team" }],
  creator: "Ramadan Radar",
  publisher: "Ramadan Radar",
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
  openGraph: {
    title: "রমাদান রাডার 🌙 | ইফতার খুঁজুন ও তারাবি ট্র্যাক করুন",
    description:
      "কাছের মসজিদে ইফতারের মেনু খুঁজুন ও সবচেয়ে দ্রুত তারাবি ট্র্যাক করুন। কমিউনিটি-চালিত, ফ্রি, রেজিস্ট্রেশন লাগবে না।",
    url: SITE_URL,
    siteName: "রমাদান রাডার",
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "রমাদান রাডার 🌙",
    description: "কাছের মসজিদে ইফতারের মেনু খুঁজুন ও সবচেয়ে দ্রুত তারাবি ট্র্যাক করুন।",
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: "religion",
  verification: {
    // google: "your-google-verification-code",
  },
};

export const viewport = {
  themeColor: "#0a0f1e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border py-6 text-center text-xs text-text-muted">
            <p>🌙 রমাদান রাডার — উম্মাহর জন্য ❤️ দিয়ে তৈরি</p>
            <p className="mt-1">কমিউনিটি-চালিত। লগইন লাগবে না।</p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <a href="/guide" className="text-text-muted hover:text-primary transition-colors">📖 গাইড</a>
              <span className="text-border">·</span>
              <a href="/privacy" className="text-text-muted hover:text-primary transition-colors">🔒 গোপনীয়তা নীতি</a>
            </div>
          </footer>
        </div>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "রমাদান রাডার",
              alternateName: "Ramadan Radar",
              url: SITE_URL,
              description:
                "কমিউনিটি-চালিত রমাদান অ্যাপ — ইফতারের মেনু খুঁজুন ও তারাবি ট্র্যাক করুন।",
              applicationCategory: "LifestyleApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "BDT",
              },
              inLanguage: "bn",
              isAccessibleForFree: true,
              creator: {
                "@type": "Organization",
                name: "Ramadan Radar Team",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
