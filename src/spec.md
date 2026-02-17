# Specification

## Summary
**Goal:** Make generated note summaries longer and ensure the UI displays the complete summary text, and fix quiz rendering so the Interactive Quiz shows up to 10 questions when available.

**Planned changes:**
- Increase offline summary generation output length so substantial uploads produce a noticeably more informative summary.
- Update dashboard summary rendering to preserve paragraphs/line breaks and display the full returned summary without truncation/collapsing.
- Fix offline quiz generation/data handling to return 10 questions when sufficient source text exists.
- Ensure the Interactive Quiz UI renders all items in `quizArray` (no unintended slicing/limiting) and the displayed count/numbering matches `quizArray.length`.

**User-visible outcome:** After uploading notes, users see a longer, more detailed summary fully rendered on the dashboard, and the Interactive Quiz displays up to 10 questions (or fewer if the source content is insufficient) with the correct question count shown.
