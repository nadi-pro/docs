# Angular Integration

Integrate Nadi with Angular applications for comprehensive error tracking.

## Installation

```bash
npm install @nadi-pro/browser @nadi-pro/angular
```

## Setup

### Basic Setup

```typescript
// main.ts
import { init } from '@nadi-pro/browser'

init({
  appKey: 'your-app-key',
  environment: environment.production ? 'production' : 'development',
  release: environment.version,
})

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err))
```

### Module Setup

```typescript
// app.module.ts
import { NgModule, ErrorHandler } from '@angular/core'
import { NadiModule, NadiErrorHandler } from '@nadi-pro/angular'

@NgModule({
  imports: [
    BrowserModule,
    NadiModule.forRoot(),
  ],
  providers: [
    { provide: ErrorHandler, useClass: NadiErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Standalone Components (Angular 14+)

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser'
import { init } from '@nadi-pro/browser'
import { provideNadi, NadiErrorHandler } from '@nadi-pro/angular'

init({
  appKey: 'your-app-key',
})

bootstrapApplication(AppComponent, {
  providers: [
    provideNadi(),
    { provide: ErrorHandler, useClass: NadiErrorHandler },
  ],
})
```

## Error Handler

### Custom Error Handler

```typescript
// error-handler.service.ts
import { ErrorHandler, Injectable } from '@angular/core'
import { captureException } from '@nadi-pro/browser'

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    // Capture to Nadi
    captureException(error, {
      tags: {
        handled: 'global',
      },
    })

    // Log to console in development
    console.error('Error caught:', error)
  }
}

// app.module.ts
@NgModule({
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
})
export class AppModule {}
```

### Zone.js Integration

Angular uses Zone.js which can affect error handling:

```typescript
// app.module.ts
import { NgModule, ErrorHandler, NgZone } from '@angular/core'

@Injectable()
export class ZoneAwareErrorHandler implements ErrorHandler {
  constructor(private zone: NgZone) {}

  handleError(error: Error): void {
    // Run outside Angular's zone for better performance
    this.zone.runOutsideAngular(() => {
      captureException(error)
    })
  }
}
```

## Services

### Nadi Service

```typescript
// nadi.service.ts
import { Injectable } from '@angular/core'
import {
  captureException,
  captureMessage,
  setUser,
  setTag,
  addBreadcrumb,
} from '@nadi-pro/browser'

@Injectable({
  providedIn: 'root',
})
export class NadiService {
  captureException(error: Error, context?: object): void {
    captureException(error, context)
  }

  captureMessage(message: string, level?: string): void {
    captureMessage(message, level)
  }

  setUser(user: { id: string; email?: string; name?: string } | null): void {
    setUser(user)
  }

  setTag(key: string, value: string): void {
    setTag(key, value)
  }

  addBreadcrumb(breadcrumb: {
    category: string
    message: string
    level?: string
    data?: object
  }): void {
    addBreadcrumb(breadcrumb)
  }
}
```

### Using the Service

```typescript
// some.component.ts
import { Component } from '@angular/core'
import { NadiService } from './nadi.service'

@Component({
  selector: 'app-some',
  template: `...`,
})
export class SomeComponent {
  constructor(private nadi: NadiService) {}

  async loadData(): Promise<void> {
    try {
      await this.dataService.load()
    } catch (error) {
      this.nadi.captureException(error, {
        tags: { component: 'SomeComponent' },
      })
    }
  }
}
```

## HTTP Interceptor

Track HTTP errors:

```typescript
// http-error.interceptor.ts
import { Injectable } from '@angular/core'
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { captureException, addBreadcrumb } from '@nadi-pro/browser'

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    addBreadcrumb({
      category: 'http',
      message: `${request.method} ${request.url}`,
      level: 'info',
    })

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        captureException(error, {
          tags: {
            type: 'http',
            status: error.status.toString(),
          },
          extra: {
            url: request.url,
            method: request.method,
            status: error.status,
            statusText: error.statusText,
          },
        })

        addBreadcrumb({
          category: 'http',
          message: `HTTP Error: ${request.method} ${request.url}`,
          level: 'error',
          data: {
            status: error.status,
          },
        })

        return throwError(() => error)
      })
    )
  }
}

// app.module.ts
@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
  ],
})
export class AppModule {}
```

## Router Integration

Track navigation:

```typescript
// app.component.ts
import { Component, OnInit } from '@angular/core'
import { Router, NavigationStart, NavigationEnd, NavigationError } from '@angular/router'
import { addBreadcrumb, captureException } from '@nadi-pro/browser'

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        addBreadcrumb({
          category: 'navigation',
          message: `Navigating to ${event.url}`,
          level: 'info',
        })
      }

      if (event instanceof NavigationEnd) {
        addBreadcrumb({
          category: 'navigation',
          message: `Navigated to ${event.url}`,
          level: 'info',
        })
      }

      if (event instanceof NavigationError) {
        captureException(event.error, {
          tags: { type: 'navigation' },
          extra: { url: event.url },
        })
      }
    })
  }
}
```

## NgRx Integration

Track store actions:

```typescript
// nadi.effects.ts
import { Injectable } from '@angular/core'
import { Actions, createEffect } from '@ngrx/effects'
import { tap } from 'rxjs/operators'
import { addBreadcrumb } from '@nadi-pro/browser'

@Injectable()
export class NadiEffects {
  trackActions$ = createEffect(
    () =>
      this.actions$.pipe(
        tap((action) => {
          addBreadcrumb({
            category: 'ngrx.action',
            message: action.type,
            level: 'info',
          })
        })
      ),
    { dispatch: false }
  )

  constructor(private actions$: Actions) {}
}
```

### Meta Reducer

```typescript
// nadi.reducer.ts
import { ActionReducer, MetaReducer } from '@ngrx/store'
import { addBreadcrumb } from '@nadi-pro/browser'

export function nadiMetaReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return (state, action) => {
    addBreadcrumb({
      category: 'ngrx',
      message: action.type,
      level: 'info',
    })

    return reducer(state, action)
  }
}

export const metaReducers: MetaReducer[] = [nadiMetaReducer]
```

## User Context

### Authentication Service

```typescript
// auth.service.ts
import { Injectable } from '@angular/core'
import { setUser } from '@nadi-pro/browser'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user: User | null = null

  set user(user: User | null) {
    this._user = user

    if (user) {
      setUser({
        id: user.id,
        email: user.email,
        name: user.name,
      })
    } else {
      setUser(null)
    }
  }

  get user(): User | null {
    return this._user
  }
}
```

## Testing

### Mock Service

```typescript
// nadi.service.mock.ts
import { Injectable } from '@angular/core'

@Injectable()
export class MockNadiService {
  captureException = jasmine.createSpy('captureException')
  captureMessage = jasmine.createSpy('captureMessage')
  setUser = jasmine.createSpy('setUser')
  setTag = jasmine.createSpy('setTag')
  addBreadcrumb = jasmine.createSpy('addBreadcrumb')
}
```

### Test Setup

```typescript
// some.component.spec.ts
import { TestBed } from '@angular/core/testing'
import { NadiService } from './nadi.service'
import { MockNadiService } from './nadi.service.mock'

describe('SomeComponent', () => {
  let nadiService: MockNadiService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: NadiService, useClass: MockNadiService },
      ],
    }).compileComponents()

    nadiService = TestBed.inject(NadiService) as unknown as MockNadiService
  })

  it('should capture error on failure', async () => {
    // trigger error
    expect(nadiService.captureException).toHaveBeenCalled()
  })
})
```

## Best Practices

### Do

- Use global error handler
- Track HTTP errors with interceptor
- Set user context after auth
- Track router navigation

### Don't

- Catch errors without reporting
- Put sensitive data in context
- Over-track actions
- Block UI with error handling

## Troubleshooting

### Errors Not Captured

1. Verify ErrorHandler is provided
2. Check Zone.js isn't swallowing errors
3. Ensure init() called before bootstrap

### Zone.js Issues

```typescript
// Errors outside Angular zone
zone.runOutsideAngular(() => {
  // This error might not be caught
})
```

## Next Steps

- [Next.js Integration](/sdks/javascript/nextjs) - Next.js setup
- [Source Maps](/sdks/javascript/source-maps) - Debug minified code
- [Web Vitals](/sdks/javascript/web-vitals) - Performance monitoring
