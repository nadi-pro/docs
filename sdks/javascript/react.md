# React Integration <VersionBadge type="coming-soon">Coming Soon</VersionBadge>

::: warning Coming Soon
The `@nadi-pro/react` package is currently under development. The documentation below describes the planned API and features.
:::

Integrate Nadi with React applications for comprehensive error tracking.

## Installation

```bash
npm install @nadi-pro/browser @nadi-pro/react
```

## Setup

### Basic Setup

```jsx
// index.js or index.tsx
import { init } from '@nadi-pro/browser'

init({
  appKey: 'your-app-key',
  environment: process.env.NODE_ENV,
  release: process.env.REACT_APP_VERSION,
})

// Then render your app
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
```

### With Error Boundary

```jsx
import { init } from '@nadi-pro/browser'
import { NadiErrorBoundary } from '@nadi-pro/react'

init({
  appKey: 'your-app-key',
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <NadiErrorBoundary>
    <App />
  </NadiErrorBoundary>
)
```

## Error Boundaries

### Basic Error Boundary

```jsx
import { NadiErrorBoundary } from '@nadi-pro/react'

function App() {
  return (
    <NadiErrorBoundary>
      <MyComponent />
    </NadiErrorBoundary>
  )
}
```

### With Fallback UI

```jsx
function ErrorFallback({ error, resetError }) {
  return (
    <div className="error-container">
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={resetError}>Try again</button>
    </div>
  )
}

function App() {
  return (
    <NadiErrorBoundary fallback={ErrorFallback}>
      <MyComponent />
    </NadiErrorBoundary>
  )
}
```

### Render Props Fallback

```jsx
<NadiErrorBoundary
  fallback={({ error, componentStack, resetError }) => (
    <div>
      <h2>Error: {error.message}</h2>
      <pre>{componentStack}</pre>
      <button onClick={resetError}>Reset</button>
    </div>
  )}
>
  <MyComponent />
</NadiErrorBoundary>
```

### With Event Handlers

```jsx
<NadiErrorBoundary
  onError={(error, componentStack, eventId) => {
    console.log('Error captured:', eventId)
  }}
  onReset={() => {
    // Clear application state
    window.location.reload()
  }}
  beforeCapture={(scope) => {
    scope.setTag('location', 'dashboard')
  }}
>
  <Dashboard />
</NadiErrorBoundary>
```

### Multiple Boundaries

Use multiple boundaries for different sections:

```jsx
function App() {
  return (
    <div>
      <NadiErrorBoundary fallback={<NavError />}>
        <Navigation />
      </NadiErrorBoundary>

      <NadiErrorBoundary fallback={<MainError />}>
        <MainContent />
      </NadiErrorBoundary>

      <NadiErrorBoundary fallback={<SidebarError />}>
        <Sidebar />
      </NadiErrorBoundary>
    </div>
  )
}
```

## Hooks

### useNadi

Access Nadi functionality in components:

```jsx
import { useNadi } from '@nadi-pro/react'

function PaymentForm() {
  const nadi = useNadi()

  const handleSubmit = async (data) => {
    nadi.addBreadcrumb({
      category: 'payment',
      message: 'Payment form submitted',
    })

    try {
      await processPayment(data)
    } catch (error) {
      nadi.captureException(error, {
        tags: { form: 'payment' },
      })
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### useErrorBoundary

Programmatically show error boundary:

```jsx
import { useErrorBoundary } from '@nadi-pro/react'

function AsyncComponent() {
  const { showBoundary } = useErrorBoundary()

  useEffect(() => {
    fetchData().catch((error) => {
      showBoundary(error)
    })
  }, [])

  return <div>...</div>
}
```

## Profiler Integration

Track component performance:

```jsx
import { Profiler } from 'react'
import { recordMetric } from '@nadi-pro/browser'

function onRenderCallback(
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) {
  recordMetric({
    name: `react.render.${id}`,
    value: actualDuration,
    unit: 'milliseconds',
    tags: { phase },
  })
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <MainContent />
    </Profiler>
  )
}
```

## Context and Tags

### Setting User Context

```jsx
import { setUser } from '@nadi-pro/browser'

function useAuth() {
  const [user, setUserState] = useState(null)

  useEffect(() => {
    if (user) {
      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
      })
    } else {
      setUser(null)
    }
  }, [user])

  return { user, setUserState }
}
```

### Adding Tags with Context

```jsx
import { NadiContext } from '@nadi-pro/react'

function App() {
  return (
    <NadiContext
      tags={{
        feature: 'dashboard',
        version: '2.0',
      }}
    >
      <Dashboard />
    </NadiContext>
  )
}
```

## Event Tracking

### Track User Actions

```jsx
import { addBreadcrumb } from '@nadi-pro/browser'

function Button({ onClick, children }) {
  const handleClick = (e) => {
    addBreadcrumb({
      category: 'ui.click',
      message: `Clicked ${children}`,
      level: 'info',
    })
    onClick?.(e)
  }

  return <button onClick={handleClick}>{children}</button>
}
```

### Track Route Changes

```jsx
import { useLocation } from 'react-router-dom'
import { addBreadcrumb } from '@nadi-pro/browser'

function RouteTracker() {
  const location = useLocation()

  useEffect(() => {
    addBreadcrumb({
      category: 'navigation',
      message: `Navigated to ${location.pathname}`,
      level: 'info',
      data: {
        pathname: location.pathname,
        search: location.search,
      },
    })
  }, [location])

  return null
}

// In your App
function App() {
  return (
    <Router>
      <RouteTracker />
      <Routes>...</Routes>
    </Router>
  )
}
```

## Redux Integration

### Middleware

```jsx
import { addBreadcrumb } from '@nadi-pro/browser'

const nadiMiddleware = (store) => (next) => (action) => {
  addBreadcrumb({
    category: 'redux.action',
    message: action.type,
    level: 'info',
    data: {
      type: action.type,
      payload: action.payload,
    },
  })

  return next(action)
}

// Add to store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(nadiMiddleware),
})
```

### Enhancer

```jsx
import { createNadiEnhancer } from '@nadi-pro/react'

const store = configureStore({
  reducer: rootReducer,
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(createNadiEnhancer()),
})
```

## Testing

### Mock Error Boundary

```jsx
// __mocks__/@nadi-pro/react.js
export const NadiErrorBoundary = ({ children }) => children
export const useNadi = () => ({
  captureException: jest.fn(),
  addBreadcrumb: jest.fn(),
})
```

### Testing Error Handling

```jsx
import { render, screen } from '@testing-library/react'
import { NadiErrorBoundary } from '@nadi-pro/react'

test('renders fallback on error', () => {
  const ThrowError = () => {
    throw new Error('Test error')
  }

  render(
    <NadiErrorBoundary fallback={<div>Error occurred</div>}>
      <ThrowError />
    </NadiErrorBoundary>
  )

  expect(screen.getByText('Error occurred')).toBeInTheDocument()
})
```

## Best Practices

### Do

- Wrap top-level app with error boundary
- Use multiple boundaries for isolation
- Set user context after authentication
- Track meaningful user actions

### Don't

- Catch errors and forget to report them
- Set sensitive data in tags/extra
- Over-use error boundaries (performance)
- Ignore error boundary fallback UX

## Troubleshooting

### Error Boundary Not Catching Errors

Error boundaries don't catch:
- Event handler errors (use try/catch)
- Async code (useEffect, promises)
- Server-side rendering errors
- Errors in the boundary itself

```jsx
// Event handlers need try/catch
const handleClick = async () => {
  try {
    await riskyOperation()
  } catch (error) {
    captureException(error)
  }
}
```

### Component Stack Missing

Ensure you're using development builds for testing. Production builds strip component names.

## Next Steps

- [Vue Integration](/sdks/javascript/vue) - Vue setup guide
- [Source Maps](/sdks/javascript/source-maps) - Debug minified code
- [Web Vitals](/sdks/javascript/web-vitals) - Performance monitoring
