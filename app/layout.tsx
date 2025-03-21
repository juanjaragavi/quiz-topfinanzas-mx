import type React from "react";
import type { Metadata } from "next";
import { metadata as metadataStrings } from "@/lib/constants";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: metadataStrings.title,
  description: metadataStrings.description,
  generator: "TopNetworks Inc.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-MX">
      <body className={`${poppins.variable} font-poppins`}>{children}</body>
    </html>
  );
}
