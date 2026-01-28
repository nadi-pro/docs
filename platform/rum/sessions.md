# Sessions

Track user sessions to understand user journeys and behavior.

## Overview

A session represents a continuous user visit to your application. Sessions help you:

- Understand user flows
- See errors in context
- Replay user actions
- Track engagement metrics

## Session Data

### Session Properties

| Property | Description |
|----------|-------------|
| **Session ID** | Unique identifier |
| **Duration** | How long the session lasted |
| **Pages** | Number of pages viewed |
| **Events** | Number of tracked events |
| **Errors** | Errors during session |
| **User** | Identified user (if any) |

### Session Timeline

```
10:00:00  Session started
10:00:00  Page: /
10:00:15  Click: "Products" link
10:00:16  Page: /products
10:00:45  Click: "Add to Cart" button
10:00:46  HTTP: POST /api/cart - 200
10:01:20  Click: "Checkout" button
10:01:21  Page: /checkout
10:01:35  Error: PaymentError
10:02:00  Session ended
```

## Session List

View all sessions with filters:

### Filtering

- **Time range** - Last hour, day, week
- **Has errors** - Sessions with errors
- **User** - Specific user's sessions
- **Duration** - Minimum/maximum duration
- **Page count** - Engagement level

### Sorting

- Most recent
- Longest duration
- Most pages
- Most errors

## Session Details

### Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Session: abc123                                            │
├─────────────────────────────────────────────────────────────┤
│  Duration: 4m 32s                                          │
│  Pages: 5                                                   │
│  Errors: 1                                                  │
│  User: john@example.com                                     │
│                                                             │
│  Device: Desktop / Chrome 120 / Windows 10                 │
│  Location: San Francisco, US                               │
└─────────────────────────────────────────────────────────────┘
```

### Event Timeline

Full timeline of session events:

- Page views
- User clicks
- Form submissions
- API requests
- Errors
- Web Vitals

### Errors in Session

When an error occurs, see it in context:

1. What happened before
2. What the user was doing
3. What happened after

### Session Replay

If enabled, watch the session:

1. Click **View Replay**
2. Watch user actions
3. Pause at error moment
4. Inspect DOM state

## User Journey Analysis

### Common Paths

See popular user flows:

```
/                → /products      → /cart          → /checkout
     45%              30%              75%
```

### Drop-off Points

Identify where users leave:

```
/checkout
├── 60% - Completed purchase
├── 25% - Abandoned at payment
└── 15% - Left before entering details
```

### Error Impact

See how errors affect journeys:

- Sessions ending after error
- Retry attempts
- Alternative paths taken

## Session Metrics

### Engagement

| Metric | Description |
|--------|-------------|
| **Avg Duration** | Average session length |
| **Avg Pages** | Average pages per session |
| **Bounce Rate** | Single-page sessions |
| **Return Rate** | Returning users |

### Performance

| Metric | Description |
|--------|-------------|
| **Avg Load Time** | Average page load |
| **Interaction Time** | Time to first interaction |
| **Error Rate** | % of sessions with errors |

## Segmentation

### By User Type

```
User Type        Sessions    Avg Duration    Errors
────────────────────────────────────────────────────
Logged in        12,345      5m 23s          2.1%
Anonymous        45,678      1m 12s          3.4%
```

### By Device

```
Device           Sessions    Avg Duration
──────────────────────────────────────────
Desktop          23,456      4m 15s
Mobile           34,567      2m 30s
Tablet           5,678       3m 45s
```

### By Geography

```
Country          Sessions    Avg Duration
──────────────────────────────────────────
United States    12,345      3m 45s
United Kingdom   8,901       4m 12s
Germany          5,678       3m 58s
```

## Session Search

Find specific sessions:

```
# User's sessions
user:john@example.com

# Sessions with errors
has:errors

# Sessions on specific page
page:/checkout

# Long sessions
duration:>5m

# Combine filters
user:john@example.com AND has:errors
```

## Privacy

### Data Collection

Control what's captured:
- Disable session replay
- Mask user inputs
- Anonymize user data

### Retention

Configure how long sessions are stored:
- 7 days
- 30 days
- 90 days
- Custom

## Next Steps

- [Performance](/platform/rum/performance) - Page performance
- [Web Vitals](/platform/rum/web-vitals) - Core Web Vitals
