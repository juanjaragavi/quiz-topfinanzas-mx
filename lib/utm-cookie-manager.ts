// UTM Cookie Manager - Handles storing and retrieving UTM parameters in cookies
import { cookies } from "next/headers";
import { UTM_PARAMS } from "./constants";

const COOKIE_OPTIONS = {
  path: "/",
  maxAge: 30 * 24 * 60 * 60, // 30 days
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

/**
 * Store UTM parameters from URL search params into cookies
 * This should be called from server components/actions when UTM params are detected
 */
export async function storeUTMParamsInCookies(searchParams: URLSearchParams) {
  const cookieStore = await cookies();

  UTM_PARAMS.forEach((param) => {
    const value = searchParams.get(param);
    if (value !== null) {
      cookieStore.set(param, value, COOKIE_OPTIONS);
    }
  });
}

/**
 * Retrieve all UTM parameters from cookies
 * Returns a URLSearchParams object with all found UTM parameters
 */
export async function getUTMParamsFromCookies(): Promise<URLSearchParams> {
  const cookieStore = await cookies();
  const utmParams = new URLSearchParams();

  UTM_PARAMS.forEach((param) => {
    const cookie = cookieStore.get(param);
    if (cookie && cookie.value) {
      utmParams.set(param, cookie.value);
    }
  });

  return utmParams;
}

/**
 * Append UTM parameters from cookies to a given URL
 * Returns the URL with UTM parameters appended
 */
export async function appendUTMParamsToUrl(baseUrl: string): Promise<string> {
  const utmParams = await getUTMParamsFromCookies();

  if (utmParams.toString()) {
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}${utmParams.toString()}`;
  }

  return baseUrl;
}

/**
 * Clear all UTM parameters from cookies
 * Useful for testing or when you want to reset tracking
 */
export async function clearUTMCookies() {
  const cookieStore = await cookies();

  UTM_PARAMS.forEach((param) => {
    cookieStore.delete(param);
  });
}
