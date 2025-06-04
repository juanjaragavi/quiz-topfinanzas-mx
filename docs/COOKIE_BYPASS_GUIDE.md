# Quiz Cookie Validation Bypass Guide

## Overview

This guide explains how to temporarily disable the 30-day cookie validation in the quiz application for testing purposes.

## How It Works

The application normally prevents users from retaking the quiz within 30 days by setting a cookie (`quiz1_completed`) when they complete the quiz. The bypass mechanism allows you to disable this validation temporarily using an environment variable.

## Implementation Details

### Modified Files

1. **app/page.tsx**: Added logic to check for the `BYPASS_QUIZ_COOKIE_VALIDATION` environment variable
2. **.env.local.example**: Documentation for the environment variable

### Logic Flow

- When `BYPASS_QUIZ_COOKIE_VALIDATION=true`, all users are treated as new users (not registered)
- The `isRegisteredUser` variable is forced to `false`, allowing everyone to go through the complete quiz flow
- The actual cookie is still set upon quiz completion, but it's ignored when the bypass is active

## Usage Instructions

### To Enable the Bypass

1. Create or modify your `.env.local` file:

   ```bash
   BYPASS_QUIZ_COOKIE_VALIDATION=true
   ```

2. Restart your development server:

   ```bash
   npm run dev
   # or
   bun dev
   ```

3. All users will now be able to take the quiz regardless of their cookie status

### To Disable the Bypass

1. Either remove the environment variable from `.env.local` or set it to `false`:

   ```bash
   BYPASS_QUIZ_COOKIE_VALIDATION=false
   ```

2. Restart your development server

3. Normal cookie validation will resume

## Security Considerations

⚠️ **WARNING**: This bypass should ONLY be used in the following scenarios:

- Local development testing
- Staging environment testing
- Temporary production debugging (with extreme caution)

**NEVER** leave this bypass enabled in production for extended periods.

## Production Deployment

If you need to use this in production temporarily:

1. Set the environment variable through your hosting provider's dashboard (e.g., Vercel, Netlify)
2. Monitor the application closely
3. Remove the environment variable as soon as testing is complete
4. Consider implementing additional security measures like:
   - IP whitelisting for bypass usage
   - Time-based automatic disabling
   - Audit logging when bypass is active

## Verification

You can verify the bypass status by checking the console logs:

```text
[app/page.tsx] User IP: xxx.xxx.xxx.xxx, Is Excluded: false, Quiz1 Completed Cookie: true, Bypass Enabled: true, Calculated isRegisteredUser: false
```

The `Bypass Enabled: true` confirms the bypass is active.

## Alternative Solutions

If you need more granular control, consider:

1. Adding specific test user emails that bypass validation
2. Implementing an admin panel to reset specific users
3. Creating a time-based bypass (e.g., bypass only during specific hours)

## Rollback

To completely remove this feature:

1. Remove the bypass logic from `app/page.tsx`
2. Delete the `.env.local.example` file entries
3. Remove any production environment variables
