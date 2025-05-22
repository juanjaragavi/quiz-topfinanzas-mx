# UTM Parameter Fix - Deployment Guide

## Critical Production Fix

### Issue Identified

The application was throwing a server-side rendering error when UTM parameters were present in the URL. This was due to Next.js 15+ behavior where `searchParams` can be a Promise in production builds.

### Fix Applied

Updated both `app/page.tsx` and `app/q2/page.tsx` to properly handle the Promise-based `searchParams`:

```typescript
// Before (causing error):
searchParams: { [key: string]: string | string[] | undefined };

// After (fixed):
searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };

// And properly await it:
const params = await searchParams;
```

## Complete List of Files Modified

1. **lib/utm-cookie-manager.ts** (NEW)
   - Centralized UTM parameter management
   - Handles cookie storage and retrieval

2. **actions/quizActions.ts** (UPDATED)
   - Added UTM parameter forwarding to all redirects
   - Imports and uses `appendUTMParamsToUrl`

3. **app/page.tsx** (UPDATED)
   - Fixed Promise-based searchParams handling
   - Stores UTM parameters in cookies on page load

4. **app/q2/page.tsx** (UPDATED)
   - Fixed Promise-based searchParams handling
   - Stores UTM parameters in cookies on page load

5. **components/analytics/utm-cookie-sync.tsx** (NEW)
   - Syncs UTM parameters from sessionStorage to cookies

6. **app/api/sync-utm/route.ts** (NEW)
   - API endpoint for client-to-server UTM sync

7. **app/layout.tsx** (UPDATED)
   - Added UTMCookieSync component

## Deployment Steps

1. **Commit and Push Changes**

   ```bash
   git add .
   git commit -m "Fix: UTM parameter forwarding and server-side rendering error"
   git push origin main
   ```

2. **Deploy to Production**
   - Deploy the updated code to your production server
   - Ensure environment variables are set correctly

3. **Test in Production**
   - Test URL: `https://quizmexico.topfinanzas.com/?utm_source=adwords&utm_medium=cpc&utm_campaign=22589599879&utm_content=178590506134`
   - Verify no server-side errors occur
   - Complete the quiz and verify redirect includes all UTM parameters

## Verification Checklist

- [ ] No server-side rendering errors with UTM parameters
- [ ] UTM parameters stored in cookies
- [ ] Quiz 1 redirects to WordPress with UTM parameters
- [ ] Quiz 2 redirects to WordPress with UTM parameters
- [ ] Returning users (with quiz_completed cookie) redirect with UTM parameters

## Monitoring

Monitor server logs for any errors related to:

- searchParams handling
- Cookie operations
- Redirect operations

## Rollback Plan

If issues persist:

1. Revert to previous commit
2. Contact development team for further investigation
3. Check Next.js version compatibility

## Success Criteria

✅ Users can access the quiz with UTM parameters without errors
✅ All UTM parameters are forwarded to WordPress destinations
✅ No server-side rendering errors in production
