# Specification

## Summary
**Goal:** Make Notes Quizzer work out-of-the-box by hard-coding the ActivePieces webhook URL in the frontend and removing any dependency on configuring `VITE_WEBHOOK_URL`.

**Planned changes:**
- Hard-code the webhook endpoint in the frontend to `https://cloud.activepieces.com/api/v1/webhooks/arB5MIDx32mR1vdmBIC0r/sync` so uploads and “Ask AI” work without build-time environment variables.
- Define and document consistent behavior when `VITE_WEBHOOK_URL` is present (either ignored or allowed to override), without adding any runtime configuration UI.
- Remove/disable any banners, warnings, prompts, or help panels that instruct users to set `VITE_WEBHOOK_URL` (including the dashboard “Webhook URL is not configured…” message).
- Update error handling so upload/Ask AI failures no longer mention missing `VITE_WEBHOOK_URL`, and instead report actual network/response errors.

**User-visible outcome:** The app no longer shows webhook-setup instructions or banners, and both file uploads and Ask AI requests work without requiring the user to configure `VITE_WEBHOOK_URL`.
