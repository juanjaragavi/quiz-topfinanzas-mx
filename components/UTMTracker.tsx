"use client";

import { useEffect } from "react";

export default function UTMTracker() {
  useEffect(() => {
    // Only run in the browser
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const utmParams = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
      ];

      // First, store UTM parameters in sessionStorage if they exist
      utmParams.forEach((param) => {
        if (params.has(param)) {
          sessionStorage.setItem(param, params.get(param) || "");
        }
      });

      // Function to add UTM parameters to links
      const addUtmParamsToLinks = () => {
        const links = document.querySelectorAll("a");

        links.forEach((link) => {
          try {
            // Only process links with href and same origin or relative links
            if (
              !link.href ||
              link.href.trim() === "" ||
              link.href.startsWith("javascript:")
            ) {
              return;
            }

            const url = new URL(link.href);

            // Skip if the link is to an external domain
            if (
              url.origin !== window.location.origin &&
              !link.href.startsWith("/")
            ) {
              return;
            }

            // Add UTM parameters from current URL or sessionStorage
            utmParams.forEach((param) => {
              // First try to get from URL, then from sessionStorage
              if (params.has(param)) {
                url.searchParams.set(param, params.get(param) || "");
              } else if (sessionStorage.getItem(param)) {
                url.searchParams.set(
                  param,
                  sessionStorage.getItem(param) || ""
                );
              }
            });

            link.href = url.toString();
          } catch (e) {
            // Handle invalid URLs silently
            console.warn("Error processing link:", link.href, e);
          }
        });
      };

      // Apply UTM parameters to links initially
      addUtmParamsToLinks();

      // Use MutationObserver to handle dynamically added links
      const observer = new MutationObserver((mutations) => {
        let shouldProcessLinks = false;

        mutations.forEach((mutation) => {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            shouldProcessLinks = true;
          }
        });

        if (shouldProcessLinks) {
          addUtmParamsToLinks();
        }
      });

      // Start observing the document
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Clean up the observer when component unmounts
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  // This component doesn't render anything
  return null;
}
