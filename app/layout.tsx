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
  title: "Abrar Hasanat: Strategy, Analytics & Operations",
  description:
    "Portfolio of Abrar Hasanat: BI pipelines, quantitative supply chain models, and cross-functional operations work. Seeking full-time Management Consulting and Product Management roles for 2027.",
  openGraph: {
    title: "Abrar Hasanat: Strategy, Analytics & Operations",
    description:
      "BI pipelines, quantitative supply chain models, and cross-functional operations. Seeking full-time Consulting and Product Management roles for 2027.",
    url: "https://abrarhasanat.com",
    siteName: "Abrar Hasanat",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abrar Hasanat: Strategy, Analytics & Operations",
    description:
      "BI pipelines, quantitative supply chain models, and cross-functional operations.",
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
