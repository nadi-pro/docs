# Source Maps

Upload source maps to see readable stack traces for minified JavaScript.

## Overview

Modern JavaScript applications use bundlers and minifiers that transform your code. This makes stack traces hard to read:

**Without source maps:**
```
Error: Something went wrong
    at n.handleClick (app.min.js:1:23456)
    at e.onClick (vendor.min.js:1:78901)
```

**With source maps:**
```
Error: Something went wrong
    at Button.handleClick (src/components/Button.tsx:45:12)
    at App.onClick (src/App.tsx:23:8)
```

## How It Works

1. Build your app with source maps enabled
2. Upload source maps to Nadi
3. When errors occur, Nadi maps minified stack traces to original source

## Generating Source Maps

### Webpack

```javascript
// webpack.config.js
module.exports = {
  mode: 'production',
  devtool: 'source-map', // or 'hidden-source-map'
  output: {
    filename: '[name].[contenthash].js',
  },
}
```

### Vite

```javascript
// vite.config.js
export default {
  build: {
    sourcemap: true, // or 'hidden'
  },
}
```

### Rollup

```javascript
// rollup.config.js
export default {
  output: {
    sourcemap: true,
  },
}
```

### esbuild

```javascript
// esbuild.config.js
require('esbuild').build({
  sourcemap: true,
})
```

### Next.js

```javascript
// next.config.js
module.exports = {
  productionBrowserSourceMaps: true,
}
```

## Uploading Source Maps

### CLI Upload

Install the Nadi CLI:

```bash
npm install -g @nadi-pro/cli
```

Upload after build:

```bash
nadi sourcemaps upload \
  --api-key YOUR_API_KEY \
  --app-key YOUR_APP_KEY \
  --release 1.0.0 \
  ./dist
```

### Webpack Plugin

```bash
npm install @nadi-pro/webpack-plugin --save-dev
```

```javascript
// webpack.config.js
const NadiWebpackPlugin = require('@nadi-pro/webpack-plugin')

module.exports = {
  plugins: [
    new NadiWebpackPlugin({
      apiKey: process.env.NADI_API_KEY,
      appKey: process.env.NADI_APP_KEY,
      release: process.env.RELEASE_VERSION,
    }),
  ],
}
```

### Vite Plugin

```bash
npm install @nadi-pro/vite-plugin --save-dev
```

```javascript
// vite.config.js
import nadi from '@nadi-pro/vite-plugin'

export default {
  plugins: [
    nadi({
      apiKey: process.env.NADI_API_KEY,
      appKey: process.env.NADI_APP_KEY,
      release: process.env.RELEASE_VERSION,
    }),
  ],
}
```

### CI/CD Upload

#### GitHub Actions

```yaml
# .github/workflows/deploy.yml
- name: Upload Source Maps
  run: |
    npx @nadi-pro/cli sourcemaps upload \
      --api-key ${{ secrets.NADI_API_KEY }} \
      --app-key ${{ secrets.NADI_APP_KEY }} \
      --release ${{ github.sha }} \
      ./dist
```

#### GitLab CI

```yaml
# .gitlab-ci.yml
upload_sourcemaps:
  script:
    - npx @nadi-pro/cli sourcemaps upload
        --api-key $NADI_API_KEY
        --app-key $NADI_APP_KEY
        --release $CI_COMMIT_SHA
        ./dist
```

## Configuration

### Release Matching

The release in your SDK must match the uploaded source maps:

```javascript
// SDK initialization
import { init } from '@nadi-pro/browser'

init({
  appKey: 'your-app-key',
  release: process.env.RELEASE_VERSION, // Must match upload
})
```

### URL Prefix

If your assets are served from a CDN:

```bash
nadi sourcemaps upload \
  --api-key YOUR_API_KEY \
  --app-key YOUR_APP_KEY \
  --release 1.0.0 \
  --url-prefix https://cdn.example.com/assets/ \
  ./dist
```

### Include/Exclude Patterns

```bash
nadi sourcemaps upload \
  --api-key YOUR_API_KEY \
  --app-key YOUR_APP_KEY \
  --release 1.0.0 \
  --include '**/*.js' \
  --include '**/*.js.map' \
  --exclude 'node_modules/**' \
  ./dist
```

## Source Map Types

### `source-map`

Full source maps in separate `.map` files.

```javascript
devtool: 'source-map'
```

**Pros:** Best debugging quality
**Cons:** Exposes source code if maps are public

### `hidden-source-map`

Same as `source-map` but no reference in the JS file.

```javascript
devtool: 'hidden-source-map'
```

**Pros:** Maps not discoverable by users
**Cons:** Need to upload separately

**Recommended for production** with Nadi upload.

### `nosources-source-map`

Maps without original source content.

```javascript
devtool: 'nosources-source-map'
```

**Pros:** Smaller maps, protects source
**Cons:** Can't see original code in Nadi

## Verifying Upload

### Check Upload Status

```bash
nadi sourcemaps list \
  --api-key YOUR_API_KEY \
  --app-key YOUR_APP_KEY \
  --release 1.0.0
```

### Validate Source Maps

```bash
nadi sourcemaps validate \
  --api-key YOUR_API_KEY \
  --app-key YOUR_APP_KEY \
  --release 1.0.0
```

### Test Error Processing

1. Upload source maps
2. Trigger a test error
3. Check the error in Nadi dashboard
4. Verify stack trace shows original file names

## Troubleshooting

### Stack Traces Not Translated

1. **Check release matches:**
   ```javascript
   // SDK
   init({ release: '1.0.0' })
   ```
   ```bash
   # Upload
   --release 1.0.0
   ```

2. **Verify source maps uploaded:**
   ```bash
   nadi sourcemaps list --release 1.0.0
   ```

3. **Check URL prefix:**
   - Error URL: `https://cdn.example.com/assets/app.js`
   - Upload prefix: `https://cdn.example.com/assets/`

### Source Maps Not Found

```bash
# Check what was uploaded
nadi sourcemaps list --release 1.0.0

# Re-upload with correct paths
nadi sourcemaps upload \
  --url-prefix https://example.com/ \
  ./dist
```

### Partial Translation

Some frames translated, others not:

- Vendor code may not have source maps
- Check all bundles have corresponding maps
- Verify `include` patterns capture all files

### Large Source Maps

If upload fails due to size:

```bash
# Compress during upload
nadi sourcemaps upload \
  --compress \
  ./dist
```

Or generate smaller maps:

```javascript
devtool: 'nosources-source-map'
```

## Security Considerations

### Protecting Source Code

1. Use `hidden-source-map` to avoid exposing maps
2. Don't serve `.map` files publicly
3. Delete local maps after upload

### Secure Upload

```bash
# Use environment variables for keys
export NADI_API_KEY=your-api-key
export NADI_APP_KEY=your-app-key

nadi sourcemaps upload ./dist
```

### Access Control

Source maps in Nadi are:
- Accessible only to team members
- Never exposed to end users
- Encrypted at rest

## Best Practices

### Do

- Upload source maps in CI/CD pipeline
- Use `hidden-source-map` in production
- Match release versions exactly
- Keep source maps for all deployed releases

### Don't

- Serve source maps publicly
- Commit source maps to version control
- Forget to upload after each deployment
- Use `eval` source maps in production

## Next Steps

- [Error Tracking](/sdks/javascript/error-tracking) - Capture errors
- [React Integration](/sdks/javascript/react) - React-specific setup
- [Configuration](/sdks/javascript/configuration) - SDK configuration
