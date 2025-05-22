# Quiz 2 Registered User Flow Fix

## Issue

Quiz 2 was incorrectly redirecting registered users immediately without letting them complete steps 1 and 2. Registered users should only skip step 3 (email/name collection).

## Solution Implemented

### 1. Updated `app/q2/page.tsx`

- Removed immediate redirect for registered users
- Now passes `isRegistered` prop to CreditCardFormQ2 component
- Registered users now go through the quiz flow

### 2. Updated `components/credit-card-form-q2.tsx`

- Added `isRegistered` prop interface
- Implemented logic to skip only step 3 for registered users
- After completing step 2, registered users are redirected directly

### 3. Added `redirectToFinalQuiz2Destination` in `actions/quizActions.ts`

- New function to handle registered user redirects for quiz 2
- Includes UTM parameter forwarding

## User Flow

### New Users

1. Step 1: Select preference
2. Step 2: Select income
3. Step 3: Enter email/name
4. Redirect to WordPress with UTM parameters

### Registered Users (with quiz2_completed cookie)

1. Step 1: Select preference
2. Step 2: Select income
3. **Skip Step 3** - Redirect directly to WordPress with UTM parameters

## Technical Details

The logic now mirrors Quiz 1's behavior:

- Both quizzes check for `isRegistered` status
- Both allow registered users to complete steps 1 and 2
- Both skip step 3 for registered users
- Both preserve UTM parameters throughout the flow

## Testing

To test the fix:

1. Complete Quiz 2 once to set the `quiz2_completed` cookie
2. Visit Quiz 2 again with UTM parameters
3. Verify you can complete steps 1 and 2
4. Verify you're redirected after step 2 (skipping step 3)
5. Verify the redirect URL includes UTM parameters
