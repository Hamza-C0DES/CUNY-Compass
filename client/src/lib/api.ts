// Thin wrapper around fetch for talking to the CUNY Compass API.
// Every call is prefixed with VITE_API_URL and throws on non-2xx responses
// so callers can just try/catch instead of checking response.ok everywhere.

export type PublicUser = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
};

export type AuthResponse = {
  token: string;
  user: PublicUser;
};

export type TransferRule = {
  fromCollege: { name: string };
  fromCourseCode: string;
  fromCourseName: string;
  fromCredits: number;

  toCollege: { name: string };
  toCourseCode: string;
  toCourseName: string;
  toCredits: number;
};

export type Course = {
  id: string;
  campus: string;
  department: string;
  courseCode: string;
  courseName: string;
  credits: string;
  grade: string | null;
  user_id: string;
  createdAt: string;
}

const API_URL = import.meta.env.VITE_API_URL;

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // The API always returns JSON, even for errors — but guard against a
  // network-level HTML error page just in case.
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error ?? `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export function signup(form: { fullName: string; email: string; password: string }) {
  return apiFetch<AuthResponse>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(form),
  });
}

export function login(form: { email: string; password: string }) {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(form),
  });
}

export function me(token: string) {
  return apiFetch<{ user: PublicUser }>("/api/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function searchTransferRules(searchCourses: string) {
  return apiFetch<TransferRule[]>(
    `/transfer?searchCourses=${encodeURIComponent(searchCourses)}`
  );
}

export function getCourses(token: string) {
  return apiFetch<Course[]>("/api/courses", {
    headers: {Authorization: `Bearer ${token}` },
  });
}