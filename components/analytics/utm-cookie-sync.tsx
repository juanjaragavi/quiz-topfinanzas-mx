"use client";

import { useEffect } from "react";
import { UTM_PARAMS } from "@/lib/constants";

// Server action to store UTM params in cookies
async function syncUTMToCookies(utmParams: Record<string, string>) {
  const response = await fetch("/api/sync-utm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(utmParams),
  });

  if (!response.ok) {
    console.error("Failed to sync UTM parameters to cookies");
  }
}

export default function UTMCookieSync() {
  useEffect(() => {
    // Only run in the browser
    if (typeof window === "undefined") return;

    // Check if we have UTM parameters in sessionStorage
    const utmParams: Record<string, string> = {};
    let hasParams = false;

    UTM_PARAMS.forEach((param) => {
      const value = sessionStorage.getItem(param);
      if (value !== null) {
        utmParams[param] = value;
        hasParams = true;
      }
    });

    // If we have UTM parameters in sessionStorage, sync them to cookies
    if (hasParams) {
      console.debug(
        "UTM Cookie Sync: Syncing UTM parameters from sessionStorage to cookies",
        utmParams
      );
      syncUTMToCookies(utmParams).catch((error) => {
        console.error("UTM Cookie Sync: Error syncing UTM parameters", error);
      });
    }
  }, []); // Run once on mount

  return null; // This component doesn't render anything
}
