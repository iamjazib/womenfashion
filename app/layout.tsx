import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Women Fashion • Pakistani Women's Clothing Sale Tracker",
  description:
    "Track live discounts, flat 50% clearances, and unstitched lawn sales across Gul Ahmed, Baroque, Asim Jofa, Limelight, Sana Safinaz, Junaid Jamshed, and Zellbury.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
