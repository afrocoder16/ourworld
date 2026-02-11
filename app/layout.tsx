import type { Metadata } from "next";
import { Cinzel, Cormorant_Garamond, Space_Mono } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "700"]
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

const mono = Space_Mono({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  title: "Library Codex Valentine",
  description: "Interactive fantasy book valentine story."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${cormorant.variable} ${mono.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}

