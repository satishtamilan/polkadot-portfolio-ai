import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/contexts/WalletContext";
import { MultiChainProvider } from "@/contexts/MultiChainContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChainLink Portfolio | Polkadot Cross-Chain Asset Tracker",
  description: "Track your assets across the Polkadot ecosystem. View balances, activity, and portfolio value across multiple parachains.",
  keywords: ["Polkadot", "Parachain", "Portfolio", "Crypto", "Blockchain", "Web3"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          <MultiChainProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="container mx-auto flex-1 px-4 py-8">
                {children}
              </main>
              <Footer />
            </div>
          </MultiChainProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
