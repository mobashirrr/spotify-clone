const MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'That email address looks invalid.',
  'auth/missing-email': 'Please enter your email.',
  'auth/missing-password': 'Please enter your password.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/email-already-in-use': 'That email is already registered. Try logging in.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/user-not-found': "We couldn't find an account with that email.",
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/too-many-requests': 'Too many attempts. Please wait a minute and try again.',
};

export function authErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = String((error as { code: unknown }).code);
    if (MESSAGES[code]) return MESSAGES[code];
  }
  if (error instanceof Error && error.message) return error.message;
  return 'Something went wrong. Please try again.';
}
