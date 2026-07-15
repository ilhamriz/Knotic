import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layouts/Navbar";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import Footer from "@/components/layouts/Footer";
import Providers from "@/components/providers/providers";
import { siteUrl } from "@/lib/metadata";
import { geistSans, geistMono, playfairDisplay } from "@/lib/fonts";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Knotic",
    template: "%s | Knotic",
  },
  description:
    "Knotic is a platform for writing, structuring, and sharing knowledge.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} font-sans`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <h1 className="hidden">Knotic</h1>
        <Providers>
          <header>
            <Navbar />
          </header>
          <main>
            <LayoutWrapper>{children}</LayoutWrapper>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
