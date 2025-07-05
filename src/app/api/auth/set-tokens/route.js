import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { accessToken, refreshToken, userId } = await request.json();

    // Validate required fields
    if (!accessToken || !refreshToken || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the response
    const response = NextResponse.json(
      { message: "Tokens stored successfully" },
      { status: 200 }
    );

    // Set httpOnly cookies for maximum security
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict",
      path: "/",
    };

    // Set access token (longer expiry since no refresh)
    response.cookies.set("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60, // 24 hours
    });

    // Set refresh token (longer expiry for manual refresh if needed)
    response.cookies.set("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Set user ID (for convenience)
    response.cookies.set("userId", userId, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Error setting tokens:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
