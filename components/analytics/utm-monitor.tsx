"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Define the UTM parameters we want to monitor
const UTM_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

export default function UtmMonitor() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Monitor UTM parameters on route changes
  useEffect(() => {
    // Don't run on server
    if (typeof window === "undefined") return;

    console.log("\n===== UTM MONITOR =====");
    console.log(`Page: ${pathname}`);

    // Check URL for UTM parameters
    const urlParams = new URLSearchParams(window.location.search);
    console.log("UTM Parameters in URL:");
    let foundInUrl = false;

    UTM_PARAM_KEYS.forEach((param) => {
      if (urlParams.has(param)) {
        console.log(`- ${param}: ${urlParams.get(param)}`);
        foundInUrl = true;
      }
    });

    if (!foundInUrl) console.log("- None found in URL");

    // Check sessionStorage for UTM parameters
    console.log("UTM Parameters in sessionStorage:");
    let foundInStorage = false;

    UTM_PARAM_KEYS.forEach((param) => {
      const value = sessionStorage.getItem(param);
      if (value !== null) {
        console.log(`- ${param}: ${value}`);
        foundInStorage = true;
      }
    });

    if (!foundInStorage) console.log("- None found in sessionStorage");
    console.log("=======================\n");
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything
}
