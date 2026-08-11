// src/lib/schemas.ts

export type Form = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const EMPTY: Form = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export function validate(form: Form): Record<string, string> {
  const errors: Record<string, string> = {};

  if (form.fullName.trim().length < 2) {
    errors.fullName = 'Enter your full name.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (form.password.length < 8) {
    errors.password = 'Use at least 8 characters.';
  }
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

export type LoginForm = {
  email: string;
  password: string;
};

export const EMPTY_LOGIN: LoginForm = {
  email: '',
  password: '',
};

export function validateLogin(form: LoginForm): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!form.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!form.password) {
    errors.password = 'Password is required.';
  }

  return errors;
}