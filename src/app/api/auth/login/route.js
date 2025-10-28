import { NextResponse } from "next/server";
import {
  credentialsAreValid,
  issueAuthCookie,
  revokeAuthCookie,
} from "@/utils/auth";

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const { username, password } = payload || {};

  if (!username || !password) {
    return NextResponse.json(
      { message: "Username and password are required." },
      { status: 400 }
    );
  }

  if (!credentialsAreValid(username, password)) {
    return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
  }

  const response = NextResponse.json({ message: "Login successful." });
  issueAuthCookie(response);
  return response;
}

export function DELETE() {
  const response = NextResponse.json({ message: "Logged out." });
  revokeAuthCookie(response);
  return response;
}
