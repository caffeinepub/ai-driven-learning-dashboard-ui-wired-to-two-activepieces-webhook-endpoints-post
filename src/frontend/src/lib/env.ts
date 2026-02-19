/**
 * Hard-coded default webhook URL for ActivePieces integration.
 * This ensures the app works out-of-the-box without requiring environment variable configuration.
 */
const DEFAULT_WEBHOOK_URL = 'https://cloud.activepieces.com/api/v1/webhooks/arB5MIDx32mR1vdmBIC0r/sync';

/**
 * Resolves the webhook URL with the following priority:
 * 1. VITE_WEBHOOK_URL environment variable (if set) - allows override
 * 2. Hard-coded default URL (always available)
 * 
 * This function always returns a valid URL.
 */
export function getWebhookUrl(): string {
  const envUrl = import.meta.env.VITE_WEBHOOK_URL;
  
  // If environment variable is set and non-empty, use it as override
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim();
  }
  
  // Otherwise, use the hard-coded default
  return DEFAULT_WEBHOOK_URL;
}

/**
 * Checks if a webhook URL is available (always true with hard-coded default).
 * Kept for backward compatibility.
 */
export function hasWebhookUrl(): boolean {
  return true;
}
