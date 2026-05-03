import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Drift Transfer",
  description: "Send large files directly from browser to browser."
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
