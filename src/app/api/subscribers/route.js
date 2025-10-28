import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { connectToDatabase } from "@/lib/db";
import { Subscriber } from "@/models/Subscriber";
import { authCookieName, tokenIsValid } from "@/utils/auth";

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const { email } = payload || {};

  if (!email || typeof email !== "string") {
    return NextResponse.json({ message: "A valid email is required." }, { status: 400 });
  }

  await connectToDatabase();

  try {
    const subscriber = await Subscriber.create({ email });

    return NextResponse.json(
      {
        message: "Tack! Vi hör av oss snart.",
        subscriber: {
          id: subscriber._id.toString(),
          email: subscriber.email,
          createdAt: subscriber.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "E-postadressen är redan registrerad." },
        { status: 409 }
      );
    }

    console.error("Failed to store email", error);
    return NextResponse.json(
      { message: "Något gick fel. Försök igen senare." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(authCookieName)?.value;

  if (!tokenIsValid(token)) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  await connectToDatabase();

  const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    subscribers: subscribers.map((subscriber) => ({
      id: subscriber._id.toString(),
      email: subscriber.email,
      createdAt: subscriber.createdAt,
    })),
  });
}
