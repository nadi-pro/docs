# Slack Integration

Receive Nadi alerts in Slack channels.

## Setup

### 1. Connect Slack

1. Go to **Settings** → **Integrations**
2. Click **Connect Slack**
3. Authorize Nadi to access your workspace
4. Select a default channel

### 2. Configure Channels

Choose which channels can receive alerts:

1. Click **Manage Channels**
2. Add channels (public or private)
3. Invite the Nadi bot to private channels

### 3. Create Alert Rules

1. Go to **Alerts** → **Rules**
2. Create a new rule
3. Select Slack as the action
4. Choose the target channel

## Notification Format

### Standard Alert

::: info Alert Preview
**New Error in my-app (production)**

`TypeError: Cannot read property 'name' of undefined`

- **Location:** app/services/UserService.php:45
- **Events:** 23 | **Users:** 12

*[ View in Nadi ] [ Resolve ] [ Ignore ]*
:::

### Rich Context

When available, alerts include:
- Error message
- File and line number
- Event and user counts
- Environment tags
- Quick action buttons

## Features

### Interactive Buttons

- **View in Nadi** - Open issue in dashboard
- **Resolve** - Mark as resolved from Slack
- **Ignore** - Mark as ignored from Slack
- **Assign** - Assign to team member

### Thread Replies

Enable threading to keep channels clean:

1. Go to **Settings** → **Slack**
2. Enable **Use Threads**

New events on the same issue reply to the original message.

### Mentions

Mention users or groups:

```yaml
actions:
  - channel: slack
    target: "#alerts"
    options:
      mention: "@oncall"
```

Or mention the channel:

```yaml
options:
  mention: "<!channel>"  # or "<!here>"
```

### Scheduled Digests

Receive summary digests instead of individual alerts:

1. Go to **Alerts** → **Digests**
2. Create a new digest
3. Select frequency (hourly, daily)
4. Choose Slack channel

## Slash Commands

Interact with Nadi from Slack:

| Command | Description |
|---------|-------------|
| `/nadi status` | View current error status |
| `/nadi recent` | Show recent issues |
| `/nadi resolve [issue-id]` | Resolve an issue |
| `/nadi ignore [issue-id]` | Ignore an issue |

## Channel Best Practices

### Channel Structure

```
#nadi-critical    - Production errors, immediate attention
#nadi-alerts      - All production alerts
#nadi-staging     - Staging environment
#nadi-digests     - Daily/weekly summaries
```

### Per-Team Channels

Route to team-specific channels:

```yaml
# Frontend errors
conditions:
  tags:
    team: frontend
actions:
  - channel: slack
    target: "#frontend-errors"

# Backend errors
conditions:
  tags:
    team: backend
actions:
  - channel: slack
    target: "#backend-errors"
```

## Troubleshooting

### Bot Not Posting

1. Check bot is in the channel
2. Verify channel permissions
3. Re-authorize the integration

### Missing Channels

1. Invite Nadi bot to private channels
2. Refresh channel list in settings

### Rate Limits

If hitting Slack rate limits:
1. Enable alert aggregation
2. Use digests for high-volume alerts
3. Reduce alert frequency

## Security

### Permissions

Nadi requests minimal permissions:
- Post messages to channels
- Read channel list
- Respond to slash commands

### Data in Slack

Alerts contain:
- Error message
- File location
- Event counts

Alerts do NOT contain:
- Full stack traces
- Request data
- User PII

## Next Steps

- [Alert Rules](/platform/alerts/rules) - Configure rules
- [Teams](/platform/alerts/teams) - Microsoft Teams
- [Webhooks](/platform/alerts/webhooks) - Custom integrations
