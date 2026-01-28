# Next.js Integration

Integrate Nadi with Next.js applications for comprehensive error tracking across client and server.

## Installation

```bash
npm install @nadi-pro/browser @nadi-pro/nextjs
```

## Setup

### Configuration File

Create `nadi.client.config.ts`:

```typescript
// nadi.client.config.ts
import { init } from '@nadi-pro/browser'

init({
  appKey: process.env.NEXT_PUBLIC_NADI_APP_KEY!,
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_VERSION,
  enableWebVitals: true,
})
```

Create `nadi.server.config.ts`:

```typescript
// nadi.server.config.ts
import { init } from '@nadi-pro/node'

init({
  apiKey: process.env.NADI_API_KEY!,
  appKey: process.env.NADI_APP_KEY!,
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_VERSION,
})
```

### Next.js Config

```javascript
// next.config.js
const { withNadi } = require('@nadi-pro/nextjs')

module.exports = withNadi({
  // Your Next.js config
})({
  nadi: {
    hideSourceMaps: true,
  },
})
```

### App Router (Next.js 13+)

```typescript
// app/layout.tsx
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

// app/error.tsx (client error boundary)
'use client'

import { useEffect } from 'react'
import { captureException } from '@nadi-pro/browser'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    captureException(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}

// app/global-error.tsx (root error boundary)
'use client'

import { useEffect } from 'react'
import { captureException } from '@nadi-pro/browser'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```

### Pages Router

```typescript
// pages/_app.tsx
import type { AppProps } from 'next/app'
import '../nadi.client.config'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

// pages/_error.tsx
import { captureException } from '@nadi-pro/browser'
import type { NextPage, NextPageContext } from 'next'

interface ErrorProps {
  statusCode?: number
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div>
      <h1>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </h1>
    </div>
  )
}

Error.getInitialProps = async ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404

  if (err) {
    captureException(err)
  }

  return { statusCode }
}

export default Error
```

## Server Components

### Error Handling

```typescript
// app/dashboard/page.tsx
import { captureException } from '@nadi-pro/node'

async function getData() {
  try {
    const res = await fetch('https://api.example.com/data')
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json()
  } catch (error) {
    captureException(error)
    throw error
  }
}

export default async function Dashboard() {
  const data = await getData()
  return <div>{/* render data */}</div>
}
```

### Route Handlers

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { captureException } from '@nadi-pro/node'

export async function GET() {
  try {
    const users = await getUsers()
    return NextResponse.json(users)
  } catch (error) {
    captureException(error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
```

## Client Components

### Error Boundary

```typescript
// components/ErrorBoundary.tsx
'use client'

import { Component, ReactNode } from 'react'
import { captureException } from '@nadi-pro/browser'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong</div>
    }

    return this.props.children
  }
}
```

### Event Handlers

```typescript
'use client'

import { captureException, addBreadcrumb } from '@nadi-pro/browser'

export function CheckoutButton() {
  const handleClick = async () => {
    addBreadcrumb({
      category: 'ui',
      message: 'Checkout button clicked',
    })

    try {
      await processCheckout()
    } catch (error) {
      captureException(error)
    }
  }

  return <button onClick={handleClick}>Checkout</button>
}
```

## Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add request ID for tracking
  const requestId = crypto.randomUUID()

  const response = NextResponse.next()
  response.headers.set('x-request-id', requestId)

  return response
}
```

## API Routes (Pages Router)

```typescript
// pages/api/data.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { captureException, withScope } from '@nadi-pro/node'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await fetchData()
    res.status(200).json(data)
  } catch (error) {
    withScope((scope) => {
      scope.setTag('api', 'data')
      scope.setExtra('query', req.query)
      captureException(error)
    })

    res.status(500).json({ error: 'Internal Server Error' })
  }
}
```

## Source Maps

### Automatic Upload

```javascript
// next.config.js
const { withNadi } = require('@nadi-pro/nextjs')

module.exports = withNadi({
  nadi: {
    // Upload source maps during build
    uploadSourceMaps: true,

    // Delete source maps after upload
    hideSourceMaps: true,

    // Release version
    release: process.env.NEXT_PUBLIC_VERSION,
  },
})()
```

### Environment Variables

```bash
# .env.local
NADI_API_KEY=your-api-key
NADI_APP_KEY=your-app-key
NEXT_PUBLIC_NADI_APP_KEY=your-app-key
NEXT_PUBLIC_VERSION=1.0.0
```

## User Context

```typescript
// app/providers.tsx
'use client'

import { useEffect } from 'react'
import { setUser } from '@nadi-pro/browser'
import { useSession } from 'next-auth/react'

export function NadiUserProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name!,
      })
    } else {
      setUser(null)
    }
  }, [session])

  return <>{children}</>
}
```

## Web Vitals

```typescript
// app/layout.tsx
import { WebVitals } from './web-vitals'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}

// app/web-vitals.tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { recordMetric } from '@nadi-pro/browser'

export function WebVitals() {
  useReportWebVitals((metric) => {
    recordMetric({
      name: metric.name,
      value: metric.value,
      tags: {
        path: window.location.pathname,
      },
    })
  })

  return null
}
```

## Testing

### Mock SDK

```typescript
// __mocks__/@nadi-pro/browser.ts
export const init = jest.fn()
export const captureException = jest.fn()
export const captureMessage = jest.fn()
export const setUser = jest.fn()
export const addBreadcrumb = jest.fn()
```

### Test Setup

```typescript
// jest.setup.ts
jest.mock('@nadi-pro/browser')
```

## Nuxt.js Alternative

For Nuxt.js, use a similar approach:

```typescript
// plugins/nadi.client.ts
import { init } from '@nadi-pro/browser'

export default defineNuxtPlugin(() => {
  init({
    appKey: useRuntimeConfig().public.nadiAppKey,
    environment: process.env.NODE_ENV,
  })
})
```

## Best Practices

### Do

- Use separate configs for client/server
- Upload source maps in CI/CD
- Track Web Vitals
- Set user context after auth

### Don't

- Expose API keys to client
- Forget server-side error handling
- Skip error boundaries
- Miss API route errors

## Troubleshooting

### Client Errors Not Captured

1. Verify `nadi.client.config.ts` is imported
2. Check `NEXT_PUBLIC_NADI_APP_KEY` is set
3. Ensure error boundaries are in place

### Server Errors Not Captured

1. Verify `nadi.server.config.ts` is imported
2. Check `NADI_API_KEY` is set
3. Ensure try/catch in API routes

### Source Maps Not Working

1. Check `uploadSourceMaps: true` in config
2. Verify API key has upload permissions
3. Check release version matches

## Next Steps

- [React Integration](/sdks/javascript/react) - React-specific features
- [Source Maps](/sdks/javascript/source-maps) - Source map configuration
- [Web Vitals](/sdks/javascript/web-vitals) - Performance monitoring
