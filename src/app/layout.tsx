import type { Metadata } from "next";
import { Outfit, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Reckoning  - Your Time Is Now",
  description: "Stop dreaming. Start running. Get clarity on where you are, a roadmap to where you want to be, and the services to get there.",
  keywords: ["business", "solopreneur", "freelancer", "small business", "coaching", "operations"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${sourceSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
