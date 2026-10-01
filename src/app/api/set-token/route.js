import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

      const secret = process.env.JWT_SECRET;

    
    const token = jwt.sign(
      { email: email.toLowerCase() },
      secret,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ success: true, message: "Token saved" });


    response.cookies.set("playplex_token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, 
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("set-token error:", error);
    return NextResponse.json({ error: "Failed to set cookie" }, { status: 500 });
  }
}