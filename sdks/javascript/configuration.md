# JavaScript Configuration

Complete configuration reference for the JavaScript SDK.

## Initialization

```javascript
import { init } from '@nadi-pro/browser'

init({
  appKey: 'your-application-key',
  // ... options
})
```

## Configuration Options

### Required

| Option | Type | Description |
|--------|------|-------------|
| `appKey` | string | Your Nadi application key |

### Core Options

```javascript
{
  // Application key (required)
  appKey: 'your-app-key',

  // Environment name
  environment: 'production', // default: 'production'

  // Application release/version
  release: '1.0.0',

  // Enable/disable SDK
  enabled: true, // default: true

  // Debug mode (logs to console)
  debug: false, // default: false
}
```

### Error Capturing Options

```javascript
{
  // Capture unhandled exceptions
  captureUnhandledExceptions: true, // default: true

  // Capture unhandled promise rejections
  captureUnhandledRejections: true, // default: true

  // Maximum errors per session
  maxErrors: 100, // default: 100

  // Sample rate (0.0 - 1.0)
  sampleRate: 1.0, // default: 1.0
}
```

### Error Filtering

```javascript
{
  // Ignore errors matching patterns
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    /Loading chunk \d+ failed/,
    /Network request failed/,
  ],

  // Ignore errors from specific URLs
  denyUrls: [
    /extensions\//i,
    /^chrome:\/\//i,
    /^moz-extension:\/\//i,
  ],

  // Only capture errors from these URLs
  allowUrls: [
    /https?:\/\/yourdomain\.com/,
  ],
}
```

### Web Vitals Options

```javascript
{
  // Enable Web Vitals monitoring
  enableWebVitals: true, // default: true

  // Web Vitals to track
  webVitals: ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'], // default: all

  // Report threshold (send when this many metrics collected)
  webVitalsReportThreshold: 5, // default: 5
}
```

### Breadcrumb Options

```javascript
{
  // Enable breadcrumb tracking
  enableBreadcrumbs: true, // default: true

  // Maximum breadcrumbs to keep
  maxBreadcrumbs: 100, // default: 100

  // Breadcrumb types to capture
  breadcrumbTypes: {
    console: true,      // console.log, etc.
    dom: true,          // clicks, inputs
    fetch: true,        // fetch requests
    xhr: true,          // XMLHttpRequest
    navigation: true,   // page navigation
    history: true,      // history API
  },
}
```

### Session Replay Options

```javascript
{
  // Enable session replay
  enableSessionReplay: false, // default: false

  // Session replay options
  sessionReplayOptions: {
    // Mask all input values
    maskAllInputs: true,

    // Mask all text content
    maskAllText: false,

    // CSS selector for elements to block
    blockClass: 'nadi-block',

    // CSS selector for elements to ignore
    ignoreClass: 'nadi-ignore',

    // Mask input types
    maskInputTypes: ['password', 'email'],

    // Sampling rate for replays
    sampleRate: 0.1,
  },
}
```

### Network Options

```javascript
{
  // API endpoint (rarely needed)
  endpoint: 'https://nadi.pro/api/',

  // Request timeout (ms)
  timeout: 5000, // default: 5000

  // Maximum retries
  maxRetries: 3, // default: 3
}
```

### Stack Trace Options

```javascript
{
  // Maximum stack frames
  maxStackFrames: 50, // default: 50

  // Include context lines from source
  includeContextLines: true, // default: true

  // Context lines before/after error
  contextLines: 5, // default: 5
}
```

## Full Configuration Example

```javascript
import { init } from '@nadi-pro/browser'

init({
  // Required
  appKey: 'your-application-key',

  // Environment
  environment: process.env.NODE_ENV || 'production',
  release: process.env.APP_VERSION || '1.0.0',

  // Error capturing
  captureUnhandledExceptions: true,
  captureUnhandledRejections: true,
  maxErrors: 100,
  sampleRate: 1.0,

  // Filtering
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    /Loading chunk \d+ failed/,
  ],
  denyUrls: [
    /extensions\//i,
    /^chrome:\/\//i,
  ],

  // Web Vitals
  enableWebVitals: true,

  // Breadcrumbs
  enableBreadcrumbs: true,
  maxBreadcrumbs: 100,

  // Session Replay
  enableSessionReplay: false,

  // Debug
  debug: process.env.NODE_ENV === 'development',
})
```

## Environment-Based Configuration

### Development

```javascript
init({
  appKey: 'your-dev-app-key',
  environment: 'development',
  debug: true,
  sampleRate: 1.0,
  enableSessionReplay: true,
})
```

### Staging

```javascript
init({
  appKey: 'your-staging-app-key',
  environment: 'staging',
  sampleRate: 1.0,
})
```

### Production

```javascript
init({
  appKey: 'your-production-app-key',
  environment: 'production',
  sampleRate: 0.1, // 10% sampling
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    /Loading chunk \d+ failed/,
  ],
})
```

## Dynamic Configuration

```javascript
import { init, setTag, setSampleRate } from '@nadi-pro/browser'

// Initialize with base config
init({
  appKey: 'your-app-key',
})

// Update configuration dynamically
if (user.isPremium) {
  setSampleRate(1.0) // Full capture for premium users
}

setTag('experiment', 'new-checkout')
```

## Lazy Loading

Load the SDK lazily to reduce initial bundle size:

```javascript
// Load SDK when needed
async function loadNadi() {
  const { init, captureException } = await import('@nadi-pro/browser')

  init({
    appKey: 'your-app-key',
  })

  return { captureException }
}

// Use later
loadNadi().then(({ captureException }) => {
  try {
    riskyOperation()
  } catch (e) {
    captureException(e)
  }
})
```

## Conditional Initialization

```javascript
// Only initialize in production
if (process.env.NODE_ENV === 'production') {
  init({
    appKey: 'your-app-key',
  })
}

// Check if initialized before use
import { isInitialized, captureException } from '@nadi-pro/browser'

if (isInitialized()) {
  captureException(error)
}
```

## Next Steps

- [Error Tracking](/sdks/javascript/error-tracking) - Capture and report errors
- [Breadcrumbs](/sdks/javascript/breadcrumbs) - Track user actions
- [Web Vitals](/sdks/javascript/web-vitals) - Performance monitoring
