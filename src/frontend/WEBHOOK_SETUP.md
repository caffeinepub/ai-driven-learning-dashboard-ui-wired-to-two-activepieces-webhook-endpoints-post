# ActivePieces Webhook Configuration

This application uses ActivePieces webhooks to process uploaded notes and answer AI questions.

## Default Configuration

**The app works out-of-the-box with a pre-configured webhook URL.** No environment variable setup is required for basic functionality.

## Overview

The application sends requests to the ActivePieces webhook with an `action` field that distinguishes between:
- `process_notes` - Processes uploaded files and returns a summary and quiz
- `ask_ai` - Answers questions about your notes using AI

## Optional: Custom Webhook URL

If you want to use your own ActivePieces webhook instead of the default, you can override it using the `VITE_WEBHOOK_URL` environment variable.

### Local Development

1. Create a `.env` file in the `frontend/` directory (if it doesn't exist)
2. Add your custom webhook URL:

