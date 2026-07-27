import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, Caveat } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/settings";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

// handwritten accent — for captions, labels and margin notes, so the site
// reads as personal/handmade rather than templated
const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vartika Collection — handmade, one piece at a time",
  description:
    "Pottery, paintings, sketches, crochet & photography by Vartika — browse the collection, commission something one-of-a-kind, or just come look around.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrument.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper-50 text-clay-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
