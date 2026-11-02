import type { Metadata } from "next";
import "./globals.css";
import { CompareProvider } from "@/context/CompareContext";
import { CompareBar } from "@/components/CompareBar";

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
      <body className="min-h-full flex flex-col">
        <CompareProvider>
          {children}
          <CompareBar />
        </CompareProvider>
      </body>
    </html>
  );
}
