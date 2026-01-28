# Dashboard

The Nadi dashboard is your central hub for monitoring and managing errors.

## Overview

When you log in, you'll see:

- **Error summary** - Total errors, affected users, trends
- **Recent issues** - Latest errors across your projects
- **Quick filters** - Filter by project, environment, time range

## Navigation

| Section | Description |
|---------|-------------|
| **Issues** | View and manage all captured errors |
| **Performance** | Web Vitals and RUM data |
| **Alerts** | Alert rules and notification history |
| **Settings** | Project and team configuration |

## Filtering

### Time Range

Select from preset ranges:
- Last hour
- Last 24 hours
- Last 7 days
- Last 30 days
- Custom range

### Project Filter

Filter errors by project when you have multiple applications.

### Environment Filter

Filter by environment:
- Production
- Staging
- Development

### Search

Search by:
- Error message
- File path
- User email
- Tag values

## Error Summary

The summary panel shows:

| Metric | Description |
|--------|-------------|
| **Total Events** | Number of error occurrences |
| **Unique Issues** | Distinct error types |
| **Affected Users** | Users who experienced errors |
| **Trend** | Change vs previous period |

## Issue List

Each issue in the list shows:

- **Error message** - First line of the error
- **Location** - File and line number
- **Event count** - How many times it occurred
- **User count** - How many users affected
- **Last seen** - When it most recently occurred
- **Status** - Unresolved, resolved, ignored

### Sorting

Sort issues by:
- Last seen (default)
- First seen
- Event count
- User count

### Bulk Actions

Select multiple issues to:
- Mark as resolved
- Mark as ignored
- Assign to team member
- Add tags

## Quick Actions

### From the List

- **Click** - View issue details
- **Star** - Mark as important
- **Resolve** - Mark as fixed
- **Ignore** - Stop tracking

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `j` / `k` | Navigate up/down |
| `Enter` | View selected issue |
| `r` | Mark as resolved |
| `i` | Mark as ignored |
| `/` | Focus search |

## Customization

### Column Display

Choose which columns to show:
- Event count
- User count
- First seen
- Last seen
- Environment
- Assignee

### Default Filters

Set default filters that persist:
1. Go to **Settings** → **Preferences**
2. Set default project, environment, time range
3. Save preferences

## Next Steps

- [Issues](/platform/dashboard/issues) - Deep dive into issue management
- [Error Details](/platform/dashboard/error-details) - Understanding error data
- [Trends](/platform/dashboard/trends) - Analyze error patterns
