import type { Metadata } from "next";
import { Cinzel, Manrope } from "next/font/google";
import "./globals.css";

const headingFont = Cinzel({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orai Jankipur Radhi Kayasth Samiti",
  description:
    "Serving Culture, Community & Devotion through events, seva, and spiritual unity.",
  keywords: [
    "Orai Jankipur Radhi Kayasth Samiti",
    "Hindu community",
    "Temple events",
    "Cultural organization",
    "Donation",
  ],
  openGraph: {
    title: "Orai Jankipur Radhi Kayasth Samiti",
    description:
      "A modern community platform celebrating culture, devotion, and social service.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
