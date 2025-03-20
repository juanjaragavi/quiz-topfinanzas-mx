# Turbopack Configuration

This project has been configured to use Turbopack for local development, which provides significantly faster build and refresh times compared to Webpack.

## What is Turbopack?

Turbopack is an incremental bundler optimized for JavaScript and TypeScript, written in Rust, and built into Next.js. It offers several advantages:

- **Faster Startup:** Initial compilation is much faster than Webpack
- **Incremental Compilation:** Only recompiles what changed, not the entire application
- **Selective HMR:** Only updates what's necessary in the browser
- **Memory Efficient:** Uses less memory than traditional bundlers

## How It's Configured

Turbopack has been configured in this project with the following:

1. **package.json**: The `dev` script has been updated to include the `--turbopack` flag:

   ```json
   "dev": "next dev --turbopack -p 3002"
   ```

2. **next.config.mjs**: Turbopack-specific configurations have been added:

   ```javascript
   experimental: {
     turbo: {
       loaders: {
         '.svg': ['@svgr/webpack'],
         '.css': ['style-loader', 'css-loader'],
       },
       resolveExtensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
     },
   }
   ```

3. **Loaders**: Necessary loaders have been installed as dev dependencies:
   - @svgr/webpack: For SVG file handling
   - style-loader: For CSS styles
   - css-loader: For CSS processing

4. **.turbo/config.json**: Advanced Turbopack configuration with cache settings and dependencies tracking

## Using Turbopack

No changes to your development workflow are needed. Simply run the development server as usual:

```bash
bun dev
```

This will automatically use Turbopack instead of Webpack. You should notice:

- Faster initial startup
- Faster page loads
- Almost instantaneous refreshes during development

## Troubleshooting

If you encounter any issues with Turbopack:

1. **Cache Issues**: Clear the Turbopack cache:

   ```bash
   rm -rf .turbo/cache
   ```

2. **Incompatible Packages**: Some packages may not be fully compatible with Turbopack yet. If you suspect this, you can temporarily disable Turbopack by running:

   ```bash
   bun run next dev -p 3002
   ```

3. **Unsupported Features**: If you use features not yet supported by Turbopack, check the [Next.js documentation](https://nextjs.org/docs/architecture/turbopack) for the latest compatibility information.
