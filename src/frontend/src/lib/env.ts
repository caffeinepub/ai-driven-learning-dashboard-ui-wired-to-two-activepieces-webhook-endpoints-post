import { getWebhookOverride } from './webhookOverride';

/**
 * Error message constant for missing webhook URL configuration.
 */
export const MISSING_WEBHOOK_ERROR = 'No webhook URL configured. Please set VITE_WEBHOOK_URL in your environment variables.';

/**
 * Resolves the single webhook URL used for both file upload (process_notes) and Ask AI (ask_ai) actions.
 * Prefers runtime override from localStorage, then falls back to VITE_WEBHOOK_URL.
 * Throws a clear error if neither is configured.
 */
export function getWebhookUrl(): string {
  // First, check for runtime override
  const override = getWebhookOverride();
  if (override) {
    return override;
  }

  // Fall back to build-time environment variable
  const url = import.meta.env.VITE_WEBHOOK_URL;

  if (!url || url.trim() === '') {
    throw new Error(MISSING_WEBHOOK_ERROR);
  }

  return url.trim();
}
