# Error Details

Understand the complete context of each error.

## Overview

When you click an issue, you see the full error details including:

- Stack trace
- Request data
- User information
- Breadcrumbs
- Tags and metadata
- Related events

## Stack Trace

### Reading Stack Traces

The stack trace shows the execution path leading to the error:

```
TypeError: Cannot read property 'name' of undefined

app/services/UserService.php in getUser at line 45
app/controllers/UserController.php in show at line 23
vendor/laravel/framework/src/Routing/Router.php in dispatch at line 680
```

- **Top frame** - Where the error occurred
- **Lower frames** - The call chain
- **Vendor frames** - Third-party code (often collapsed)

### In-App vs Vendor Code

Nadi distinguishes your code from vendor code:

- **In-app** (highlighted) - Your application code
- **Vendor** (dimmed) - Libraries and frameworks

Configure in your SDK which paths are "in-app".

### Source Context

If source maps are uploaded, you'll see:

```javascript
43 |   const user = await findUser(id);
44 |
45 |   return user.name;  // ← Error occurred here
46 | }
47 |
```

### Frame Details

Click a frame to see:

- Full file path
- Function/method name
- Arguments (if available)
- Local variables (if available)

## Request Data

For web requests, you'll see:

### URL & Method

```
POST /api/users/123/update
```

### Headers

```
Host: example.com
Content-Type: application/json
User-Agent: Mozilla/5.0...
X-Request-ID: abc123
```

Sensitive headers (Authorization, Cookie) are filtered by default.

### Query Parameters

```
page=1
limit=20
```

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "[FILTERED]"
}
```

Sensitive fields are automatically filtered.

## User Information

If user identification is configured:

| Field | Example |
|-------|---------|
| ID | 12345 |
| Email | user@example.com |
| Name | John Doe |
| IP | 192.168.1.1 |

### User History

See all errors for this user:
- Click the user ID
- View their error timeline
- See affected pages/features

## Breadcrumbs

Breadcrumbs show what happened before the error:

```
10:30:15  [navigation]  User navigated to /dashboard
10:30:16  [http]        GET /api/user/profile - 200
10:30:17  [ui.click]    Clicked "Edit Profile" button
10:30:18  [http]        POST /api/user/update - 500
10:30:18  [error]       TypeError: Cannot read property 'name'
```

### Breadcrumb Categories

| Category | Description |
|----------|-------------|
| `navigation` | Page/route changes |
| `http` | API requests |
| `ui` | User interactions |
| `console` | Console output |
| `error` | Previous errors |

### Filtering Breadcrumbs

Filter breadcrumbs by category or search by message.

## Tags

Tags are key-value pairs for filtering:

```
environment: production
release: 1.2.3
server: web-01
browser: Chrome 120
```

### Default Tags

Automatically captured:
- Environment
- Release/version
- Server name
- Browser (JavaScript)
- OS (JavaScript)

### Custom Tags

Tags set by your SDK:
- Feature flags
- User segments
- A/B test variants

## Extra Data

Additional context attached by your SDK:

```json
{
  "order_id": 12345,
  "cart_total": 99.99,
  "items_count": 3
}
```

## Environment Information

System context when error occurred:

| Info | Example |
|------|---------|
| Runtime | PHP 8.2.1 |
| Framework | Laravel 10.0 |
| OS | Ubuntu 22.04 |
| Server | nginx/1.24 |
| Memory | 128MB limit |

## Event History

See all occurrences of this issue:

### Event List

Each event shows:
- Timestamp
- User (if identified)
- Environment
- Any unique context

### Event Comparison

Compare two events to see differences in:
- Request data
- User
- Environment
- Custom data

## Related Issues

Issues that might be related:

- Same user affected
- Same time window
- Similar stack trace
- Same release

## Actions

### Copy Error

Copy formatted error for:
- Stack Overflow question
- Internal documentation
- Support ticket

### Share Link

Generate a shareable link to this error:
- Direct link to issue
- Link to specific event
- Link with time range

### Create External Issue

Create linked issues in:
- GitHub
- GitLab
- Jira
- Linear

### Download Event Data

Export event as:
- JSON
- CSV

## Session Replay

If session replay is enabled:

1. Click **View Replay**
2. Watch user actions before error
3. See DOM at time of error

[Learn more about Session Replay →](/sdks/javascript/session-replay)

## Next Steps

- [Trends](/platform/dashboard/trends) - Analyze error patterns
- [Issues](/platform/dashboard/issues) - Manage issues
