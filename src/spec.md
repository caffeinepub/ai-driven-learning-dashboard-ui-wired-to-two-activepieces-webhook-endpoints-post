# Specification

## Summary
**Goal:** Hide the "Ask AI About Your Notes" section from the dashboard without permanently removing the code.

**Planned changes:**
- Add a feature flag or boolean control to conditionally render the "Ask AI About Your Notes" section
- Update the dashboard component to check the flag before displaying the Ask AI section
- Ensure the flag can be easily toggled to re-enable the section in the future

**User-visible outcome:** The "Ask AI About Your Notes" section will no longer appear in the dashboard, while all other features (quizzes, summaries, file upload) continue to work normally.
