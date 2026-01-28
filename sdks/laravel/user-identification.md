# User Identification

Track which users are affected by errors to prioritize fixes and provide better support.

## Overview

User identification allows you to:

- See which users are affected by specific errors
- Search for all errors affecting a particular user
- Prioritize fixes based on user impact
- Provide better customer support

## Automatic User Identification

Enable automatic user identification in `config/nadi.php`:

```php
'user' => [
    'auto_identify' => true,
    'fields' => ['id', 'email', 'name'],
    'capture_ip' => true,
],
```

When enabled, the SDK automatically captures authenticated user information.

## Manual User Identification

Set user information explicitly:

```php
use Nadi\Laravel\Facades\Nadi;

Nadi::setUser([
    'id' => $user->id,
    'email' => $user->email,
    'name' => $user->name,
]);
```

### Additional User Fields

Include any relevant user information:

```php
Nadi::setUser([
    'id' => $user->id,
    'email' => $user->email,
    'name' => $user->name,
    'username' => $user->username,
    'subscription' => $user->subscription_plan,
    'company' => $user->company?->name,
]);
```

## IP Address Tracking

By default, the SDK captures the user's IP address for geographic context:

```php
// config/nadi.php
'user' => [
    'capture_ip' => true,
],
```

To disable IP capturing:

```php
'user' => [
    'capture_ip' => false,
],
```

## Identifying Anonymous Users

For users who aren't logged in, you can still track them:

```php
use Nadi\Laravel\Facades\Nadi;

// Using session ID
Nadi::setUser([
    'id' => 'anon:' . session()->getId(),
]);

// Using a tracking cookie
Nadi::setUser([
    'id' => 'anon:' . request()->cookie('tracking_id'),
]);
```

## User Context in Middleware

Set user context early using middleware:

```php
namespace App\Http\Middleware;

use Nadi\Laravel\Facades\Nadi;

class IdentifyUserForNadi
{
    public function handle($request, $next)
    {
        if ($user = $request->user()) {
            Nadi::setUser([
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'subscription' => $user->subscription_plan,
            ]);
        } else {
            // Track anonymous users with session ID
            Nadi::setUser([
                'id' => 'anon:' . session()->getId(),
            ]);
        }

        return $next($request);
    }
}
```

Register after authentication middleware:

```php
// app/Http/Kernel.php
protected $middlewareGroups = [
    'web' => [
        // ...
        \Illuminate\Session\Middleware\StartSession::class,
        \App\Http\Middleware\Authenticate::class,
        \App\Http\Middleware\IdentifyUserForNadi::class,
    ],
];
```

## Multi-Tenant Applications

For multi-tenant apps, include tenant information:

```php
Nadi::setUser([
    'id' => $user->id,
    'email' => $user->email,
    'name' => $user->name,
]);

Nadi::setTag('tenant_id', $tenant->id);
Nadi::setExtra('tenant_name', $tenant->name);
```

## API Authentication

For API requests with token authentication:

```php
namespace App\Http\Middleware;

use Nadi\Laravel\Facades\Nadi;

class IdentifyApiUser
{
    public function handle($request, $next)
    {
        if ($user = $request->user('api')) {
            Nadi::setUser([
                'id' => $user->id,
                'email' => $user->email,
                'type' => 'api_user',
            ]);

            // Track which API token was used
            if ($token = $user->currentAccessToken()) {
                Nadi::setExtra('token_name', $token->name);
            }
        }

        return $next($request);
    }
}
```

## Clearing User Data

Clear user information when they log out:

```php
use Nadi\Laravel\Facades\Nadi;

class LogoutController
{
    public function __invoke()
    {
        Nadi::setUser(null);
        auth()->logout();

        return redirect('/');
    }
}
```

Or using Laravel's event system:

```php
// EventServiceProvider.php
use Illuminate\Auth\Events\Logout;

protected $listen = [
    Logout::class => [
        ClearNadiUser::class,
    ],
];
```

```php
// app/Listeners/ClearNadiUser.php
use Nadi\Laravel\Facades\Nadi;

class ClearNadiUser
{
    public function handle(Logout $event)
    {
        Nadi::setUser(null);
    }
}
```

## Privacy Considerations

### GDPR Compliance

For GDPR compliance, consider:

1. **Minimize data collection** - Only capture necessary fields
2. **Anonymize when possible** - Use hashed identifiers
3. **Respect consent** - Honor user privacy preferences

```php
// Only track users who have consented
if ($user->hasConsentedToErrorTracking()) {
    Nadi::setUser([
        'id' => $user->id,
        'email' => $user->email,
    ]);
} else {
    Nadi::setUser([
        'id' => 'gdpr-opted-out:' . hash('sha256', $user->id),
    ]);
}
```

### Hashing Sensitive Data

Hash identifiable information:

```php
Nadi::setUser([
    'id' => hash('sha256', $user->id . config('app.key')),
    // Don't include email
]);
```

## Best Practices

### Do

- Include user ID (required for user tracking)
- Include email for easier user identification
- Use consistent field names
- Set user context early in the request lifecycle

### Don't

- Include passwords or authentication tokens
- Include sensitive personal information (SSN, etc.)
- Include payment information
- Over-collect user data

## Viewing User Data

In the Nadi dashboard:

1. **Error Details** - See affected users for each error
2. **User Search** - Find all errors for a specific user
3. **Impact Analysis** - See unique user count per error

## Next Steps

- [Performance Monitoring](/sdks/laravel/performance) - Track application performance
- [Sampling](/sdks/laravel/sampling) - Control event volume
- [Troubleshooting](/sdks/laravel/troubleshooting) - Debug integration issues
