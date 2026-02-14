# Specification

## Summary
**Goal:** Re-implement a dedicated Summary Delete (trash icon) button that clears only the Summary text, and produce a fresh deployable build draft.

**Planned changes:**
- Add a trash icon button in the top-right of the Summary card header that clears only the Summary state (sets summary to an empty string).
- Add a dedicated Summary delete handler in `frontend/src/pages/DashboardPage.tsx` and pass it to `frontend/src/components/SummaryCard.tsx` via props (e.g., `onDelete`).
- Ensure Summary deletion does not affect the Quiz state/section, and that the existing Quiz delete behavior remains unchanged.
- Create a new build draft and run the standard build + deployment pipeline to produce a fresh deployment.

**User-visible outcome:** When a Summary is shown, users can click a trash icon on the Summary card to remove only the Summary content (the Summary section disappears), while the Quiz remains visible and unchanged; a new deployment is available.
