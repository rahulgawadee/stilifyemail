import crypto from "crypto";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "stilify.se";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "stilify.se";
const ADMIN_SECRET = process.env.ADMIN_SECRET || "stilify.se-admin-secret";
const COOKIE_NAME = "admin_token";

export function credentialsAreValid(username, password) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

function tokenForUsername(username) {
  return crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(username)
    .digest("hex");
}

export function issueAuthCookie(response) {
  const token = tokenForUsername(ADMIN_USERNAME);
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 4,
  });
}

export function revokeAuthCookie(response) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
}

export function tokenIsValid(token) {
  if (!token) {
    return false;
  }

  const expected = tokenForUsername(ADMIN_USERNAME);
  const providedBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

export const authCookieName = COOKIE_NAME;
