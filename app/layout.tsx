import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drift Transfer - Free peer-to-peer file transfer",
  description:
    "Send large files directly from browser to browser with WebRTC. Free, open source, no account, no server-side file storage.",
  metadataBase: new URL("https://drift-transfer.vercel.app"),
  openGraph: {
    title: "Drift Transfer",
    description:
      "A free, open-source peer-to-peer file transfer app. No account, no server-side file storage.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Drift Transfer",
    description:
      "Send large files directly from browser to browser. Free, open source, no account."
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
