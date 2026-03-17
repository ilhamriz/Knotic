import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layouts/Navbar";
import LayoutWrapper from "@/components/layouts/LayoutWrapper";
import Footer from "@/components/layouts/Footer";

export const metadata: Metadata = {
  // metadataBase: new URL("https://knotic.vercel.app"),
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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <h1 className="hidden">Knotic</h1>
        <header>
          <Navbar />
        </header>
        <main>
          <LayoutWrapper>{children}</LayoutWrapper>
        </main>
        <Footer />
      </body>
    </html>
  );
}
