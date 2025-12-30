import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import LenisProvider from "@/components/LenisProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chill Thrive",
  description:
    "Chill Thrive is a premium wellness & recovery brand focused on Ice Bath Therapy, Jacuzzi Therapy, and Steam Bath Experiences. The brand promotes physical recovery, mental resilience, and high-performance living through cold & heat therapy",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
    other: {
      rel: "icon",
      url: "/favicon.png",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
          <link rel="icon" href="/favicon.png" />
        </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <LenisProvider>
        {children}
        </LenisProvider>
      </body>
    </html>
  );
}

