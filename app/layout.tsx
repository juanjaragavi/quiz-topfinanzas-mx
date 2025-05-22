import type React from "react";
import type { Metadata } from "next";
import { metadata as metadataStrings } from "@/lib/constants";
import { Poppins } from "next/font/google";
import "./globals.css";
import UtmPersister from "@/components/analytics/utm-persister";
import UtmMonitor from "@/components/analytics/utm-monitor";
import { Suspense } from "react";
import NavigationProvider from "@/components/providers/navigation-provider";

// Import analytics and tracking components
import GoogleTagManager, {
  GoogleTagManagerNoScript,
} from "@/components/GoogleTagManager";
import UTMTracker from "@/components/UTMTracker";

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
      <head>
        {/* GTM script is placed here via the GoogleTagManager component */}
        <GoogleTagManager />
      </head>
      <body className={`${poppins.variable} font-poppins`}>
        <NavigationProvider>
          <Suspense fallback={null}>
            <GoogleTagManagerNoScript />
            <UTMTracker />
            <UtmPersister />
            {process.env.NODE_ENV === "development" && <UtmMonitor />}
          </Suspense>
          {children}
        </NavigationProvider>
      </body>
    </html>
  );
}
