import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { UTM_PARAMS } from "@/lib/constants";

const COOKIE_OPTIONS = {
  path: "/",
  maxAge: 30 * 24 * 60 * 60, // 30 days
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();

    // Validate and store UTM parameters
    UTM_PARAMS.forEach((param) => {
      if (param in body && typeof body[param] === "string") {
        cookieStore.set(param, body[param], COOKIE_OPTIONS);
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error syncing UTM parameters:", error);
    return NextResponse.json(
      { error: "Failed to sync UTM parameters" },
      { status: 500 }
    );
  }
}
