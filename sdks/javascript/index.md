# JavaScript SDK

The Nadi JavaScript SDK provides error monitoring and real user monitoring (RUM) for browser applications.

## Requirements

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ support
- Or transpilation for older browsers

## Installation

### npm

```bash
npm install @nadi-pro/browser
```

### yarn

```bash
yarn add @nadi-pro/browser
```

### CDN

```html
<script src="https://cdn.nadi.pro/browser/1.0.0/nadi.min.js"></script>
```

## Quick Start

### ES Modules

```javascript
import { init, captureException } from '@nadi-pro/browser'

init({
  appKey: 'your-application-key',
})

// Errors are now automatically captured
```

### CommonJS

```javascript
const Nadi = require('@nadi-pro/browser')

Nadi.init({
  appKey: 'your-application-key',
})
```

### CDN / Script Tag

```html
<script src="https://cdn.nadi.pro/browser/1.0.0/nadi.min.js"></script>
<script>
  Nadi.init({
    appKey: 'your-application-key',
  })
</script>
```

## Configuration

```javascript
import { init } from '@nadi-pro/browser'

init({
  // Required
  appKey: 'your-application-key',

  // Optional
  environment: 'production',
  release: '1.0.0',

  // Features
  enableWebVitals: true,
  enableBreadcrumbs: true,
  enableSessionReplay: false,

  // Sampling
  sampleRate: 1.0,

  // Filtering
  ignoreErrors: [/ResizeObserver loop/i],
  denyUrls: [/extensions\//i, /^chrome:\/\//i],
})
```

## Basic Usage

### Automatic Error Capturing

Once initialized, unhandled errors and promise rejections are automatically captured:

```javascript
// These are automatically captured
throw new Error('Something went wrong')

// Unhandled promise rejection
Promise.reject(new Error('Async error'))
```

### Manual Error Capturing

```javascript
import { captureException, captureMessage } from '@nadi-pro/browser'

try {
  riskyOperation()
} catch (error) {
  captureException(error)
}

// Capture a message
captureMessage('User completed checkout')
```

### Adding Context

```javascript
import { setUser, setTag, setExtra } from '@nadi-pro/browser'

// Set user information
setUser({
  id: '12345',
  email: 'user@example.com',
  name: 'John Doe',
})

// Set tags for filtering
setTag('subscription', 'premium')

// Set extra data
setExtra('cart_items', 5)
```

## Features

### Web Vitals

Monitor Core Web Vitals automatically:

```javascript
init({
  appKey: 'your-app-key',
  enableWebVitals: true,
})
```

Captured metrics:
- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)
- **FCP** (First Contentful Paint)
- **TTFB** (Time to First Byte)

### Breadcrumbs

Track user interactions leading up to an error:

```javascript
import { addBreadcrumb } from '@nadi-pro/browser'

addBreadcrumb({
  category: 'ui.click',
  message: 'User clicked checkout button',
  level: 'info',
})
```

Automatic breadcrumbs:
- Console logs
- XHR/Fetch requests
- Click events
- Navigation
- Form submissions

### Session Replay

Replay user sessions to understand how errors occurred:

```javascript
init({
  appKey: 'your-app-key',
  enableSessionReplay: true,
  sessionReplayOptions: {
    maskAllInputs: true,
    blockClass: 'no-replay',
  },
})
```

## What's Captured

| Data | Description |
|------|-------------|
| Error | Message, stack trace, type |
| Browser | Name, version, user agent |
| URL | Current page URL |
| User | ID, email (if set) |
| Breadcrumbs | User actions before error |
| Web Vitals | Performance metrics |
| Session | Session ID, duration |

## Framework Integrations

The SDK provides integrations for popular frameworks:

- [React](/sdks/javascript/react)
- [Vue](/sdks/javascript/vue)
- [Angular](/sdks/javascript/angular)
- [Next.js](/sdks/javascript/nextjs)

## Next Steps

- [Configuration](/sdks/javascript/configuration) - Full configuration options
- [Error Tracking](/sdks/javascript/error-tracking) - Advanced error tracking
- [Breadcrumbs](/sdks/javascript/breadcrumbs) - Track user actions
- [Web Vitals](/sdks/javascript/web-vitals) - Performance monitoring
- [Source Maps](/sdks/javascript/source-maps) - Debug minified code
