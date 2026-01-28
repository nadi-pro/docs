# JavaScript Error Tracking

Capture and report JavaScript errors from your browser applications.

## Automatic Error Capturing

Once initialized, the SDK automatically captures:

- Uncaught exceptions
- Unhandled promise rejections
- Console errors (optional)

```javascript
import { init } from '@nadi-pro/browser'

init({
  appKey: 'your-app-key',
  captureUnhandledExceptions: true,
  captureUnhandledRejections: true,
})

// This is automatically captured
throw new Error('Something went wrong')

// This is also captured
Promise.reject(new Error('Async error'))
```

## Manual Error Capturing

### Capturing Exceptions

```javascript
import { captureException } from '@nadi-pro/browser'

try {
  riskyOperation()
} catch (error) {
  captureException(error)
}
```

### With Additional Context

```javascript
captureException(error, {
  tags: {
    feature: 'checkout',
    payment_method: 'credit_card',
  },
  extra: {
    order_id: '12345',
    cart_total: 99.99,
  },
})
```

### Capturing Messages

```javascript
import { captureMessage } from '@nadi-pro/browser'

// Simple message
captureMessage('User completed checkout')

// With level
captureMessage('API rate limit approaching', 'warning')

// With context
captureMessage('Large file upload started', 'info', {
  extra: {
    file_size: 52428800,
    file_type: 'video/mp4',
  },
})
```

Available levels: `debug`, `info`, `warning`, `error`, `fatal`

## Error Filtering

### Ignore Specific Errors

```javascript
init({
  appKey: 'your-app-key',
  ignoreErrors: [
    // String match
    'ResizeObserver loop limit exceeded',

    // Regex match
    /Loading chunk \d+ failed/,

    // Network errors
    /Network request failed/,

    // Browser extension errors
    /extension/i,
  ],
})
```

### Filter by URL

```javascript
init({
  appKey: 'your-app-key',

  // Ignore errors from these URLs
  denyUrls: [
    /extensions\//i,
    /^chrome:\/\//i,
    /^moz-extension:\/\//i,
    /googletagmanager\.com/,
  ],

  // Only capture from your domain
  allowUrls: [
    /https?:\/\/(www\.)?yourdomain\.com/,
  ],
})
```

### Before Send Hook

Filter errors programmatically:

```javascript
import { init, beforeSend } from '@nadi-pro/browser'

init({
  appKey: 'your-app-key',
})

beforeSend((event, hint) => {
  const error = hint.originalException

  // Don't capture canceled requests
  if (error?.name === 'AbortError') {
    return null
  }

  // Don't capture from bots
  if (/bot|crawler|spider/i.test(navigator.userAgent)) {
    return null
  }

  // Modify the event
  event.tags.browser = navigator.userAgent

  return event
})
```

## Error Levels

### Automatic Level Assignment

| Error Type | Level |
|------------|-------|
| `Error` | error |
| `TypeError` | error |
| `ReferenceError` | error |
| `SyntaxError` | fatal |
| Unhandled rejection | error |
| Console.error | error |

### Setting Custom Levels

```javascript
import { captureException, withScope } from '@nadi-pro/browser'

withScope((scope) => {
  scope.setLevel('warning')
  captureException(error)
})

// Or inline
captureException(error, { level: 'warning' })
```

## Adding Context

### User Context

```javascript
import { setUser } from '@nadi-pro/browser'

// After login
setUser({
  id: '12345',
  email: 'user@example.com',
  name: 'John Doe',
  subscription: 'premium',
})

// After logout
setUser(null)
```

### Tags

```javascript
import { setTag, setTags } from '@nadi-pro/browser'

setTag('feature', 'checkout')

setTags({
  experiment: 'new-ui',
  version: '2.0',
})
```

### Extra Data

```javascript
import { setExtra, setExtras } from '@nadi-pro/browser'

setExtra('cart_items', 5)

setExtras({
  cart_total: 99.99,
  coupon_applied: true,
})
```

## Scopes

### Temporary Scope

```javascript
import { withScope, captureException } from '@nadi-pro/browser'

withScope((scope) => {
  scope.setTag('transaction', 'payment')
  scope.setExtra('amount', 99.99)
  scope.setLevel('error')

  captureException(error)
})
// Scope is cleared after the callback
```

### Global Scope

```javascript
import { configureScope } from '@nadi-pro/browser'

configureScope((scope) => {
  scope.setTag('app_version', '2.0.0')
  scope.setUser({ id: '123' })
})
```

## Error Boundaries (React)

See [React Integration](/sdks/javascript/react) for React-specific error boundaries.

## Async Error Handling

### Promises

```javascript
import { captureException } from '@nadi-pro/browser'

async function fetchData() {
  try {
    const response = await fetch('/api/data')
    return await response.json()
  } catch (error) {
    captureException(error, {
      tags: { operation: 'fetch_data' },
    })
    throw error
  }
}
```

### Event Handlers

```javascript
button.addEventListener('click', async () => {
  try {
    await processClick()
  } catch (error) {
    captureException(error, {
      tags: { handler: 'button_click' },
    })
  }
})
```

## Network Error Tracking

Track failed network requests:

```javascript
import { captureException, addBreadcrumb } from '@nadi-pro/browser'

async function apiCall(url, options) {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`)
      error.response = response
      throw error
    }

    return response.json()
  } catch (error) {
    addBreadcrumb({
      category: 'http',
      message: `Failed: ${options.method || 'GET'} ${url}`,
      level: 'error',
      data: {
        url,
        method: options.method,
        status: error.response?.status,
      },
    })

    captureException(error, {
      tags: {
        error_type: 'network',
        endpoint: new URL(url).pathname,
      },
    })

    throw error
  }
}
```

## Grouping Errors

### Custom Fingerprinting

```javascript
captureException(error, {
  fingerprint: ['checkout-payment-failed'],
})

// Dynamic fingerprint
captureException(error, {
  fingerprint: ['api-error', endpoint, error.code],
})
```

### Using beforeSend

```javascript
beforeSend((event, hint) => {
  const error = hint.originalException

  // Group all timeout errors
  if (error?.code === 'TIMEOUT') {
    event.fingerprint = ['timeout-error']
  }

  return event
})
```

## Testing Error Tracking

```javascript
import { captureException, isInitialized } from '@nadi-pro/browser'

// Verify SDK is ready
if (isInitialized()) {
  // Trigger a test error
  captureException(new Error('Test error from Nadi SDK'))
}
```

## Next Steps

- [Breadcrumbs](/sdks/javascript/breadcrumbs) - Track user actions
- [Web Vitals](/sdks/javascript/web-vitals) - Performance monitoring
- [Source Maps](/sdks/javascript/source-maps) - Debug minified code
