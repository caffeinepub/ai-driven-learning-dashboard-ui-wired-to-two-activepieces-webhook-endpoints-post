# Specification

## Summary
**Goal:** Make the Summary shown on the public/deployed app link noticeably longer and more informative after users upload notes, without changing quiz questions or quiz behavior.

**Planned changes:**
- Update the Summary rendering to show the full returned summary text (preserve line breaks; avoid UI truncation/cutoff).
- When a webhook is configured, detect when the webhook-provided summary is below a minimum length threshold and automatically generate an expanded client-side summary from the uploaded file text as a fallback.
- Keep quiz behavior unchanged: when a webhook is configured, always display the webhook-provided `quiz_array` as-is, even if the summary falls back to client-side generation.
- Add actionable English error messaging if client-side text extraction fails (e.g., image-only PDFs), while leaving quiz rendering unaffected.

**User-visible outcome:** After uploading a document via the deployed/public link, users see a substantially longer, multi-paragraph summary (when the source content supports it), and the interactive quiz remains exactly as before.
