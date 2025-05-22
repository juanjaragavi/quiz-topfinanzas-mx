# UTM Parameter Forwarding Test Guide

## Overview

This document outlines how to test the UTM parameter forwarding implementation for the Next.js quiz application.

## Test Scenarios

### 1. Direct UTM Parameter Test (Quiz 1)

- **URL**: `https://quizmexico.topfinanzas.com/?utm_source=adwords&utm_medium=cpc&utm_campaign=22589599879&utm_content=178590506134`
- **Expected Behavior**:
  1. UTM parameters are stored in cookies when the page loads
  2. Complete the quiz (select preference, income, enter email/name)
  3. Upon submission, redirect to: `https://topfinanzas.com/mx/encuentra-tu-solucion-financiera-ideal-1/?utm_source=adwords&utm_medium=cpc&utm_campaign=22589599879&utm_content=178590506134`

### 2. Direct UTM Parameter Test (Quiz 2)

- **URL**: `https://quizmexico.topfinanzas.com/q2?utm_source=adwords&utm_medium=cpc&utm_campaign=22589599879&utm_content=178590506134`
- **Expected Behavior**:
  1. UTM parameters are stored in cookies when the page loads
  2. Complete the quiz
  3. Upon submission, redirect to: `https://topfinanzas.com/mx/soluciones-financieras/guia-tarjeta-de-credito-nu-bank/?utm_source=adwords&utm_medium=cpc&utm_campaign=22589599879&utm_content=178590506134`

### 3. Session Persistence Test

- **URL**: `https://quizmexico.topfinanzas.com/?utm_source=test&utm_medium=session&utm_campaign=12345`
- **Steps**:
  1. Visit the URL with UTM parameters
  2. Navigate to `/q2` (without UTM parameters in URL)
  3. Verify UTM parameters are still maintained
  4. Complete quiz and verify redirect includes original UTM parameters

### 4. Registered User Test

- **Setup**: Complete quiz 1 once to set the `quiz1_completed` cookie
- **URL**: `https://quizmexico.topfinanzas.com/?utm_source=return&utm_medium=user&utm_campaign=98765`
- **Expected Behavior**:
  1. User who completed quiz 1 previously and is not on excluded IP
  2. Should be redirected immediately after steps 1 & 2 to: `https://topfinanzas.com/mx/encuentra-tu-solucion-financiera-ideal-1/?utm_source=return&utm_medium=user&utm_campaign=98765`

## Verification Steps

### Browser Developer Tools

1. Open Chrome/Firefox Developer Tools
2. Go to Application/Storage tab
3. Check Cookies for the domain
4. Verify UTM parameter cookies are set:
   - `utm_source`
   - `utm_medium`
   - `utm_campaign`
   - `utm_content`
   - `utm_term` (if provided)

### Console Logs

Monitor console for debug messages:

- `[app/page.tsx] Stored UTM parameters in cookies: ...`
- `[app/q2/page.tsx] Stored UTM parameters in cookies: ...`
- `Quiz 1 redirect URL with UTM params: ...`
- `Quiz 2 redirect URL with UTM params: ...`

## Implementation Details

### Key Components

1. **UTM Cookie Manager** (`lib/utm-cookie-manager.ts`):
   - Stores UTM parameters in server-side cookies
   - Retrieves UTM parameters from cookies
   - Appends UTM parameters to redirect URLs

2. **Server Actions** (`actions/quizActions.ts`):
   - `submitQuiz1`: Appends UTM params to Quiz 1 redirect
   - `submitQuiz2`: Appends UTM params to Quiz 2 redirect
   - `redirectToFinalQuiz1Destination`: Handles registered user redirects

3. **Page Components**:
   - `app/page.tsx`: Stores UTM params from URL in cookies
   - `app/q2/page.tsx`: Stores UTM params from URL in cookies

4. **Client-Side Sync** (`components/analytics/utm-cookie-sync.tsx`):
   - Syncs UTM parameters from sessionStorage to cookies via API

5. **API Route** (`app/api/sync-utm/route.ts`):
   - Handles client-to-server UTM parameter synchronization

### Cookie Settings

- **Duration**: 30 days
- **HttpOnly**: Yes (security)
- **Secure**: Yes (in production)
- **SameSite**: Lax

## Troubleshooting

### UTM Parameters Not Forwarding

1. Check if cookies are being set properly
2. Verify no browser extensions are blocking cookies
3. Check console for error messages
4. Ensure UTM parameters are properly formatted in the URL

### Testing Locally

- Use `http://localhost:3000/?utm_source=test&utm_medium=local`
- Cookies will not be secure in development mode
- Check Network tab to see redirect headers

### Production Testing

- Ensure HTTPS is used
- Verify cookies are set with secure flag
- Test across different browsers
