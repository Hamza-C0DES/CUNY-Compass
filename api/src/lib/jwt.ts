import jwt from "jsonwebtoken";

// Fail fast at startup rather than signing tokens with `undefined` all night.
// Typed explicitly as `string` so the check below actually narrows it for
// the functions below — TS won't narrow a closed-over `string | undefined`.
const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
  throw new Error("JWT_SECRET is not set. Add it to api/.env.");
}
const JWT_SECRET: string = rawSecret;

// What we put inside the token. Keep this small — it's base64, not encrypted,
// so anyone holding the token can read these fields.
export type AuthPayload = {
  userId: string;
};

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}
