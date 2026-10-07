import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://abrarhasanat.com"),
  title: "Abrar Hasanat | Economics & Business Analysis",
  description:
    "Abrar Hasanat, Carleton economics student graduating in 2027. Explore research and business analysis projects.",
  openGraph: {
    title: "Abrar Hasanat | Economics & Business Analysis",
    description:
      "Economics research and business analysis projects by Abrar Hasanat, Carleton Class of 2027.",
    url: "https://abrarhasanat.com",
    siteName: "Abrar Hasanat",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abrar Hasanat | Economics & Business Analysis",
    description:
      "Research and business analysis projects by Abrar Hasanat.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plexMono.variable}`}>
      <body className="bg-navy text-ink-primary font-sans antialiased selection:bg-accent/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
