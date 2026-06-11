import type { Metadata } from "next";
import { Anton, Fraunces, Inter } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getSiteUrl } from "@/lib/utils";
import "./globals.css";

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "NK Izola Store — Official Club Shop",
    template: "%s | NK Izola Store",
  },
  description:
    "Official merchandise of NK Izola. Jerseys, scarves and fan wear for supporters of the club from the Slovenian coast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
