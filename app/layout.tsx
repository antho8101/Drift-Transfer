import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Drift Transfer - Free Peer-to-Peer File Transfer",
    template: "%s | Drift Transfer"
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: "Anthony", url: siteConfig.authorUrl }],
  creator: "Anthony",
  publisher: "Anthony",
  keywords: [...siteConfig.keywords],
  category: "technology",
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    title: "Drift Transfer - Free Peer-to-Peer File Transfer",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Drift Transfer - Free peer-to-peer file transfer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Drift Transfer - Free Peer-to-Peer File Transfer",
    description: siteConfig.description,
    images: ["/og-image.svg"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
          <div className="fixed bottom-4 right-4 z-50 sm:bottom-5 sm:right-5">
            <LanguageSwitcher />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
