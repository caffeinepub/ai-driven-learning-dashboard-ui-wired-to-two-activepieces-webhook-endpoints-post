# ActivePieces Webhook Configuration

This application uses ActivePieces webhooks to process uploaded notes and answer AI questions. Both features use a single webhook URL configured via the `VITE_WEBHOOK_URL` environment variable.

## Overview

The application sends requests to your ActivePieces webhook with an `action` field that distinguishes between:
- `process_notes` - Processes uploaded files and returns a summary and quiz
- `ask_ai` - Answers questions about your notes using AI

## Configuration

### Local Development

1. Create a `.env` file in the `frontend/` directory (if it doesn't exist)
2. Add your webhook URL:

