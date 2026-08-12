// Manual validation for the auth routes. No schema library — just the checks
// signup/login actually need, so it's obvious what's being enforced and why.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SignupInput = {
  fullName: string;
  email: string;
  password: string;
};

export function validateSignup(body: unknown): { errors: string[]; value: SignupInput | null } {
  const errors: string[] = [];
  const b = (body ?? {}) as Record<string, unknown>;

  const fullName = typeof b.fullName === "string" ? b.fullName.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const password = typeof b.password === "string" ? b.password : "";

  if (!fullName) errors.push("fullName is required");
  if (!email || !EMAIL_RE.test(email)) errors.push("a valid email is required");
  if (password.length < 8) errors.push("password must be at least 8 characters");

  if (errors.length > 0) return { errors, value: null };
  return { errors, value: { fullName, email, password } };
}

export type LoginInput = {
  email: string;
  password: string;
};

export function validateLogin(body: unknown): { errors: string[]; value: LoginInput | null } {
  const errors: string[] = [];
  const b = (body ?? {}) as Record<string, unknown>;

  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const password = typeof b.password === "string" ? b.password : "";

  if (!email) errors.push("email is required");
  if (!password) errors.push("password is required");

  if (errors.length > 0) return { errors, value: null };
  return { errors, value: { email, password } };
}
