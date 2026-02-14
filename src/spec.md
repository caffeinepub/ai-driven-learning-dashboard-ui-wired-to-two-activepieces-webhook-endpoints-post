# Specification

## Summary
**Goal:** Support using a single ActivePieces webhook URL for both file upload processing and Ask AI by adding action-based routing in requests and improving endpoint configuration fallback and docs.

**Planned changes:**
- Add frontend endpoint URL fallback logic so either VITE_ENDPOINT_A_URL or VITE_ENDPOINT_B_URL can be used for both upload and Ask AI when only one is set, while preserving existing behavior when both are set (including when identical).
- Include an explicit `action` field in request bodies: uploads send `action="process_notes"` (multipart/form-data) and Ask AI sends `action="ask_ai"` (JSON) along with existing fields.
- Keep/ensure client-side response validation and English error messages for missing env configuration and invalid response formats.
- Update `frontend/.env.example` English guidance to document using one webhook URL for both actions (or separate URLs), without committing any real webhook URL.

**User-visible outcome:** Users can configure one ActivePieces webhook URL (or two) and successfully upload notes and ask questions, with the automation able to route requests by the sent `action` value and with clear English errors if configuration/response formats are invalid.
