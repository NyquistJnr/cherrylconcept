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

    // Set access token (shorter expiry)
    response.cookies.set("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60, // 15 minutes
    });

    // Set refresh token (longer expiry)
    response.cookies.set("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Set user ID (for convenience, not sensitive)
    response.cookies.set("userId", userId, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60, // 7 days
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
