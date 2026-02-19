# Deployment Guide

This document describes how to create a new build draft and deploy the application using the current repository state.

## Creating a New Build Draft

A build draft represents a snapshot of your current codebase that will be built and deployed through the platform's CI/CD pipeline.

### Steps to Deploy

1. **Trigger a new build draft**
   - The platform will automatically create a draft from the current repository state
   - No code changes are required unless you're adding new features

2. **Build pipeline execution**
   - The pipeline will:
     - Install dependencies
     - Run TypeScript compilation checks
     - Build the frontend application
     - Deploy canisters to the Internet Computer
     - Generate deployment URLs

3. **Post-deployment verification**
   - Open the deployed app URL provided by the platform
   - Verify authentication works (Internet Identity sign-in)
   - Test core functionality:
     - File upload with webhook processing
     - Ask AI feature
     - Quiz generation and interaction

## Configuration

### Webhook URL

The app includes a pre-configured webhook URL and works without any environment variable setup. If you need to use a custom ActivePieces webhook:

1. Set the `VITE_WEBHOOK_URL` environment variable in your deployment platform
2. Redeploy the application

See [WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md) for detailed webhook configuration instructions.

## Troubleshooting

### Build Failures

- Check that all TypeScript files compile without errors
- Ensure all dependencies in `package.json` are compatible
- Review build logs for specific error messages

### Deployment Access

- Verify you can access the deployed URL
- Check that Internet Identity authentication is working
- Ensure the backend canister is properly initialized

### Webhook Issues

If uploads or AI requests fail after deployment:
- Verify the webhook endpoint is accessible
- Check ActivePieces flow logs for errors
- Ensure the flow returns the expected JSON structure
- See [WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md) for response format requirements

## Additional Resources

- [Webhook Setup Guide](./WEBHOOK_SETUP.md) - Detailed webhook configuration instructions
- [README.md](../README.md) - General project documentation
