/**
 * Client-side webhook URL override utility.
 * Allows users to configure the webhook URL at runtime via localStorage.
 */

const WEBHOOK_OVERRIDE_KEY = 'caffeine_webhook_url_override';

/**
 * Validates a webhook URL.
 * Returns an error message if invalid, or null if valid.
 */
export function validateWebhookUrl(url: string): string | null {
  if (!url || url.trim() === '') {
    return 'Webhook URL cannot be empty.';
  }

  const trimmed = url.trim();
  
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return 'Webhook URL must start with http:// or https://';
  }

  return null;
}

/**
 * Saves the webhook URL override to localStorage.
 * Validates before saving.
 */
export function saveWebhookOverride(url: string): { success: boolean; error?: string } {
  const validationError = validateWebhookUrl(url);
  
  if (validationError) {
    return { success: false, error: validationError };
  }

  try {
    localStorage.setItem(WEBHOOK_OVERRIDE_KEY, url.trim());
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: 'Failed to save webhook URL. Please check your browser settings.' 
    };
  }
}

/**
 * Retrieves the saved webhook URL override from localStorage.
 * Returns null if no override is saved.
 */
export function getWebhookOverride(): string | null {
  try {
    const saved = localStorage.getItem(WEBHOOK_OVERRIDE_KEY);
    return saved && saved.trim() !== '' ? saved.trim() : null;
  } catch {
    return null;
  }
}

/**
 * Clears the saved webhook URL override from localStorage.
 */
export function clearWebhookOverride(): void {
  try {
    localStorage.removeItem(WEBHOOK_OVERRIDE_KEY);
  } catch {
    // Silently fail if localStorage is unavailable
  }
}
