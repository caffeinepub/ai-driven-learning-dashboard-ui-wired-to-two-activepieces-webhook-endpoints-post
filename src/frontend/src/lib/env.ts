/**
 * Resolves the webhook URL for file upload (process_notes action).
 * Falls back to VITE_ENDPOINT_B_URL if VITE_ENDPOINT_A_URL is not set.
 */
export function getEndpointA(): string {
  const urlA = import.meta.env.VITE_ENDPOINT_A_URL;
  const urlB = import.meta.env.VITE_ENDPOINT_B_URL;

  // If A is set, use it
  if (urlA && urlA.trim() !== '') {
    return urlA;
  }

  // Fall back to B if available
  if (urlB && urlB.trim() !== '') {
    return urlB;
  }

  // Neither is set
  throw new Error(
    'No webhook URL configured. Please set at least one of VITE_ENDPOINT_A_URL or VITE_ENDPOINT_B_URL in your environment variables. You can use the same URL for both file upload and AI questions.'
  );
}

/**
 * Resolves the webhook URL for Ask AI (ask_ai action).
 * Falls back to VITE_ENDPOINT_A_URL if VITE_ENDPOINT_B_URL is not set.
 */
export function getEndpointB(): string {
  const urlA = import.meta.env.VITE_ENDPOINT_A_URL;
  const urlB = import.meta.env.VITE_ENDPOINT_B_URL;

  // If B is set, use it
  if (urlB && urlB.trim() !== '') {
    return urlB;
  }

  // Fall back to A if available
  if (urlA && urlA.trim() !== '') {
    return urlA;
  }

  // Neither is set
  throw new Error(
    'No webhook URL configured. Please set at least one of VITE_ENDPOINT_A_URL or VITE_ENDPOINT_B_URL in your environment variables. You can use the same URL for both file upload and AI questions.'
  );
}
