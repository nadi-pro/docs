# Breadcrumbs

Track user actions and events leading up to an error for better debugging context.

## Overview

Breadcrumbs are a trail of events that occurred before an error. They help you understand:

- What the user was doing
- What API calls were made
- What navigation occurred
- The sequence of events leading to the error

## Automatic Breadcrumbs

The SDK automatically captures common breadcrumbs:

| Category | Description | Example |
|----------|-------------|---------|
| `console` | Console logs | `console.log('clicked')` |
| `dom` | DOM interactions | Button clicks, form inputs |
| `fetch` | Fetch requests | API calls |
| `xhr` | XHR requests | Legacy AJAX calls |
| `navigation` | Page navigation | Page loads, URL changes |
| `history` | History API | pushState, replaceState |

### Configuration

```javascript
init({
  appKey: 'your-app-key',
  enableBreadcrumbs: true,
  maxBreadcrumbs: 100,
  breadcrumbTypes: {
    console: true,
    dom: true,
    fetch: true,
    xhr: true,
    navigation: true,
    history: true,
  },
})
```

## Manual Breadcrumbs

Add custom breadcrumbs for important events:

```javascript
import { addBreadcrumb } from '@nadi-pro/browser'

addBreadcrumb({
  category: 'auth',
  message: 'User logged in',
  level: 'info',
  data: {
    method: 'oauth',
    provider: 'google',
  },
})
```

### Breadcrumb Properties

| Property | Type | Description |
|----------|------|-------------|
| `category` | string | Category for grouping (e.g., 'auth', 'ui') |
| `message` | string | Human-readable description |
| `level` | string | Severity: debug, info, warning, error |
| `data` | object | Additional data (optional) |
| `timestamp` | number | Unix timestamp (auto-set if omitted) |

### Available Levels

- `debug` - Detailed debugging info
- `info` - General information
- `warning` - Potential issues
- `error` - Errors that were handled

## Common Patterns

### User Actions

```javascript
// Button click
document.querySelector('#checkout-btn').addEventListener('click', () => {
  addBreadcrumb({
    category: 'ui.click',
    message: 'Checkout button clicked',
    level: 'info',
  })
  startCheckout()
})

// Form submission
document.querySelector('form').addEventListener('submit', (e) => {
  addBreadcrumb({
    category: 'ui.form',
    message: 'Contact form submitted',
    level: 'info',
    data: {
      form_id: e.target.id,
    },
  })
})
```

### Navigation

```javascript
// Route change (manual tracking)
router.beforeEach((to, from) => {
  addBreadcrumb({
    category: 'navigation',
    message: `Navigated to ${to.path}`,
    level: 'info',
    data: {
      from: from.path,
      to: to.path,
    },
  })
})
```

### API Calls

```javascript
async function fetchUser(id) {
  addBreadcrumb({
    category: 'http',
    message: `Fetching user ${id}`,
    level: 'info',
  })

  try {
    const response = await fetch(`/api/users/${id}`)
    const user = await response.json()

    addBreadcrumb({
      category: 'http',
      message: `Fetched user ${id} successfully`,
      level: 'info',
      data: { status: response.status },
    })

    return user
  } catch (error) {
    addBreadcrumb({
      category: 'http',
      message: `Failed to fetch user ${id}`,
      level: 'error',
      data: { error: error.message },
    })
    throw error
  }
}
```

### State Changes

```javascript
// Redux middleware
const nadiMiddleware = (store) => (next) => (action) => {
  addBreadcrumb({
    category: 'redux',
    message: `Action: ${action.type}`,
    level: 'info',
    data: {
      action: action.type,
      payload: action.payload,
    },
  })
  return next(action)
}
```

### Authentication

```javascript
async function login(credentials) {
  addBreadcrumb({
    category: 'auth',
    message: 'Login attempt',
    level: 'info',
  })

  try {
    const user = await authService.login(credentials)

    addBreadcrumb({
      category: 'auth',
      message: 'Login successful',
      level: 'info',
      data: { user_id: user.id },
    })

    return user
  } catch (error) {
    addBreadcrumb({
      category: 'auth',
      message: 'Login failed',
      level: 'error',
      data: { reason: error.message },
    })
    throw error
  }
}
```

## Filtering Breadcrumbs

### Before Send

Filter breadcrumbs before sending:

```javascript
import { beforeSend } from '@nadi-pro/browser'

beforeSend((event) => {
  // Remove sensitive data from breadcrumbs
  event.breadcrumbs = event.breadcrumbs?.map((breadcrumb) => {
    if (breadcrumb.category === 'http') {
      // Remove auth tokens from URLs
      breadcrumb.data.url = breadcrumb.data.url?.replace(
        /token=[^&]+/,
        'token=[REDACTED]'
      )
    }
    return breadcrumb
  })

  return event
})
```

### Custom Filter

```javascript
import { setBreadcrumbFilter } from '@nadi-pro/browser'

setBreadcrumbFilter((breadcrumb) => {
  // Don't capture debug-level breadcrumbs in production
  if (breadcrumb.level === 'debug') {
    return null
  }

  // Don't capture health check requests
  if (breadcrumb.data?.url?.includes('/health')) {
    return null
  }

  return breadcrumb
})
```

## Breadcrumb Categories

### Recommended Categories

| Category | Use For |
|----------|---------|
| `auth` | Authentication events |
| `ui.click` | Click events |
| `ui.input` | Input/form events |
| `http` | HTTP requests |
| `navigation` | Page/route changes |
| `console` | Console output |
| `state` | State changes |
| `user` | User actions |
| `error` | Handled errors |

### Category Conventions

Use dot notation for subcategories:

```javascript
addBreadcrumb({
  category: 'payment.stripe',
  message: 'Payment intent created',
})

addBreadcrumb({
  category: 'payment.stripe',
  message: 'Card validated',
})
```

## Maximum Breadcrumbs

Control how many breadcrumbs are kept:

```javascript
init({
  appKey: 'your-app-key',
  maxBreadcrumbs: 50, // Keep last 50 breadcrumbs
})
```

When the limit is reached, oldest breadcrumbs are removed.

## Clearing Breadcrumbs

Clear breadcrumbs when appropriate:

```javascript
import { clearBreadcrumbs } from '@nadi-pro/browser'

// After logout
function logout() {
  clearBreadcrumbs()
  setUser(null)
  router.push('/login')
}
```

## Viewing Breadcrumbs

In the Nadi dashboard, breadcrumbs appear in the error details:

1. Click on an error to view details
2. Scroll to the "Breadcrumbs" section
3. View the timeline of events before the error

## Best Practices

### Do

- Add breadcrumbs for significant user actions
- Include relevant data (IDs, status codes)
- Use consistent category names
- Clear breadcrumbs on logout/session end

### Don't

- Include sensitive data (passwords, tokens)
- Add too many breadcrumbs (noise)
- Use breadcrumbs for verbose logging
- Forget to filter sensitive URLs

## Next Steps

- [Web Vitals](/sdks/javascript/web-vitals) - Performance monitoring
- [Session Replay](/sdks/javascript/session-replay) - Replay user sessions
- [Error Tracking](/sdks/javascript/error-tracking) - Capture errors
