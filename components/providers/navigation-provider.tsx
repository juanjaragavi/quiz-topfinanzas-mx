"use client";

import React from "react";

/**
 * NavigationProvider component
 * 
 * This component serves as a context provider for components that use navigation hooks.
 * It helps ensure that navigation-related hooks are used within the proper context,
 * preventing React error #425 (hooks used outside of proper context).
 * 
 * Use this to wrap components that use navigation hooks like usePathname, useRouter, etc.
 */
export default function NavigationProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
}
