"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

// Define the UTM parameters we want to track
const UTM_PARAM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
];

export default function UtmPersister() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Store UTM parameters in sessionStorage when they appear in the URL
  useEffect(() => {
    // Only run in the browser
    if (typeof window === "undefined") return;

    // Log for debugging
    console.debug("UTM Persister: Checking URL for UTM parameters");

    // Check if we have any UTM parameters in the current URL
    const hasUtmParams = UTM_PARAM_KEYS.some((param) =>
      searchParams.has(param)
    );

    if (hasUtmParams) {
      console.debug(
        "UTM Persister: Found UTM parameters in URL, storing to sessionStorage"
      );

      // Save UTM parameters to sessionStorage
      UTM_PARAM_KEYS.forEach((param) => {
        if (searchParams.has(param)) {
          const value = searchParams.get(param);
          if (value) {
            console.debug(`UTM Persister: Storing ${param}=${value}`);
            sessionStorage.setItem(param, value);
          } else {
            // If UTM param exists but has no value, keep empty string
            console.debug(`UTM Persister: Storing ${param}="" (empty)`);
            sessionStorage.setItem(param, "");
          }
        }
      });
    }
  }, [searchParams]);

  // Append stored UTM parameters to the URL on navigation if they are missing
  useEffect(() => {
    // Only run in the browser
    if (typeof window === "undefined") return;

    // Don't run on initial render or when URL already has UTM params
    const urlHasUtmParams = UTM_PARAM_KEYS.some((param) =>
      searchParams.has(param)
    );
    if (urlHasUtmParams) return;

    // Check if we have any stored UTM parameters
    let hasStoredUtmParams = false;
    const storedUtmParams: Record<string, string> = {};

    UTM_PARAM_KEYS.forEach((param) => {
      const storedValue = sessionStorage.getItem(param);
      if (storedValue !== null) {
        // Include empty strings
        storedUtmParams[param] = storedValue;
        hasStoredUtmParams = true;
      }
    });

    // If we have stored UTM parameters, add them to the URL
    if (hasStoredUtmParams) {
      console.debug("UTM Persister: Adding stored UTM parameters to URL");

      const currentParams = new URLSearchParams(searchParams.toString());

      // Add stored UTM parameters to current URL params
      Object.entries(storedUtmParams).forEach(([param, value]) => {
        currentParams.set(param, value);
      });

      // Create new URL with UTM parameters
      const newUrl = `${pathname}${
        currentParams.toString() ? `?${currentParams.toString()}` : ""
      }`;

      // Use replace to avoid adding to browser history
      router.replace(newUrl, { scroll: false });
    }
  }, [pathname, searchParams, router]);

  return null; // This component doesn't render anything
}
