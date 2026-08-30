import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import localFont from "next/font/local";
import "./globals.css";
import { getSettings } from "@/lib/repo";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const fraunces = localFont({
  src: "./fonts/Fraunces-Variable.ttf",
  variable: "--font-fraunces",
  display: "swap",
  weight: "300 700",
});

const inter = localFont({
  src: "./fonts/Inter-Variable.ttf",
  variable: "--font-inter",
  display: "swap",
  weight: "400 700",
});

const mono = localFont({
  src: [
    { path: "./fonts/IBMPlexMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/IBMPlexMono-Medium.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: settings.siteTitle,
      template: `%s — ${settings.siteTitle}`,
    },
    description: settings.metaDescription,
    openGraph: {
      title: settings.siteTitle,
      description: settings.metaDescription,
      type: "website",
      images: settings.ogImageUrl ? [settings.ogImageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteTitle,
      description: settings.metaDescription,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}>
      <body className="bg-paper text-ink font-body antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded focus:bg-teal-900 focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
