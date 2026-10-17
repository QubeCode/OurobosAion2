import type { Metadata } from "next";
import { Cinzel, Source_Sans_3, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { DemoBanner } from "@/components/demo-banner";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { GuildStoreProvider } from "@/context/guild-store";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ouroboros — Guilde AION 2",
    template: "%s · Ouroboros",
  },
  description:
    "Ouroboros, guilde francophone d’Aion 2 : entraide, PvE & PvP, GS min. 1400. Rejoins la confrérie.",
  openGraph: {
    title: "Ouroboros — Guilde AION 2",
    description:
      "Guilde francophone accueillante. Progresser ensemble sans prise de tête.",
    locale: "fr_FR",
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
      lang="fr"
      className={`dark ${cinzel.variable} ${sourceSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <GuildStoreProvider>
          <DemoBanner />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <Toaster />
        </GuildStoreProvider>
      </body>
    </html>
  );
}
