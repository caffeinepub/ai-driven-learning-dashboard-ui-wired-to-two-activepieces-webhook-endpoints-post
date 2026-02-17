import { getWebhookOverride } from './webhookOverride';

/**
 * Error message constant for missing webhook URL configuration.
 */
export const MISSING_WEBHOOK_ERROR = 'No webhook URL configured. Please set VITE_WEBHOOK_URL in your environment variables.';

/**
 * Checks if a webhook URL is configured (either via override or environment variable)
 */
export function hasWebhookUrl(): boolean {
  const override = getWebhookOverride();
  if (override) {
    return true;
  }
  
  const url = import.meta.env.VITE_WEBHOOK_URL;
  return !!(url && url.trim() !== '');
}

/**
 * Resolves the single webhook URL used for both file upload (process_notes) and Ask AI (ask_ai) actions.
 * Prefers runtime override from localStorage, then falls back to VITE_WEBHOOK_URL.
 * Returns null if neither is configured (no longer throws).
 */
export function getWebhookUrl(): string | null {
  // First, check for runtime override
  const override = getWebhookOverride();
  if (override) {
    return override;
  }

  // Fall back to build-time environment variable
  const url = import.meta.env.VITE_WEBHOOK_URL;

  if (!url || url.trim() === '') {
    return null;
  }

  return url.trim();
}
