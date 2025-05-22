# CRITICAL FIX: Next.js 15 + React 19 UTM Parameter Error

## Issue

Server-side rendering error (500) when accessing the site with UTM parameters in production. The error was caused by Next.js 15+ with React 19 where `searchParams` can be a Promise in production builds.

## Root Cause

In Next.js 15 with React 19, the `searchParams` prop behavior changed:

- In development: `searchParams` is a plain object
- In production: `searchParams` can be a Promise that needs to be awaited

## Solution Applied

### Updated both `app/page.tsx` and `app/q2/page.tsx`

```typescript
interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: PageProps) {
  try {
    // Handle searchParams safely
    let params: { [key: string]: string | string[] | undefined } = {};
    
    if (searchParams) {
      // Check if searchParams is a Promise and await it
      if (searchParams instanceof Promise) {
        params = await searchParams;
      } else {
        params = searchParams;
      }
    }
    
    // Process UTM parameters...
  } catch (error) {
    console.error("[app/page.tsx] Error processing search params:", error);
  }
  
  // Rest of the component...
}
```

## Key Changes

1. **Made searchParams optional** with `?` to handle cases where it might be undefined
2. **Added instanceof Promise check** to properly detect and await Promise-based searchParams
3. **Wrapped in try-catch** to gracefully handle any errors
4. **Added error logging** for debugging in production

## Testing

After deploying these changes:

1. Test without UTM parameters: `https://quizmexico.topfinanzas.com/`
2. Test with UTM parameters: `https://quizmexico.topfinanzas.com/?utm_source=adwords&utm_medium=cpc&utm_campaign=22589599879&utm_content=178590506134`

Both should work without server errors.

## Deployment Commands

```bash
git add app/page.tsx app/q2/page.tsx
git commit -m "Fix: Next.js 15 searchParams Promise handling for UTM parameters"
git push origin main
```

## Verification

Check server logs for:

- No 500 errors when accessing with UTM parameters
- Console logs showing UTM parameters being stored: `[app/page.tsx] Stored UTM parameters in cookies:`

## Important Notes

- This is a breaking change in Next.js 15 with React 19
- The fix is backwards compatible with older Next.js versions
- Always handle searchParams as potentially being a Promise in production
