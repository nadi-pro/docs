# Microsoft Teams Integration

Receive Nadi alerts in Microsoft Teams channels.

## Setup

### 1. Create Incoming Webhook

1. Open Microsoft Teams
2. Navigate to the target channel
3. Click **...** → **Connectors**
4. Search for **Incoming Webhook**
5. Click **Configure**
6. Name it "Nadi Alerts"
7. Copy the webhook URL

### 2. Add to Nadi

1. Go to **Settings** → **Integrations**
2. Click **Add Microsoft Teams**
3. Paste the webhook URL
4. Name the integration
5. Click **Save**

### 3. Test Connection

1. Click **Test** next to the integration
2. Check the Teams channel for the test message

## Notification Format

### Standard Alert

```
┌─────────────────────────────────────────────────────────────┐
│ 🔴 Nadi Alert                                              │
│ New Error in my-app (production)                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ TypeError: Cannot read property 'name' of undefined        │
│                                                             │
│ • Location: app/services/UserService.php:45                │
│ • Events: 23                                               │
│ • Users Affected: 12                                       │
│ • Environment: production                                   │
│                                                             │
│ [ View in Nadi ]                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Adaptive Card

Nadi uses Adaptive Cards for rich formatting:

- Color-coded severity
- Expandable details
- Quick action buttons
- Links to dashboard

## Features

### Action Buttons

- **View in Nadi** - Opens issue in browser
- **Resolve** - Mark issue resolved
- **Ignore** - Mark issue ignored

### Mentions

Mention users in alerts:

```yaml
actions:
  - channel: teams
    target: "Production Alerts"
    options:
      mention: "user@company.com"
```

### Channel Selection

Create multiple integrations for different channels:

| Channel | Use Case |
|---------|----------|
| Production Alerts | Critical errors |
| Dev Team | All errors |
| SRE Team | Performance alerts |

## Alert Configuration

### Per-Channel Routing

Route different alerts to different channels:

```yaml
# Critical to #production
name: Critical Alerts
trigger: new_issue
conditions:
  levels: [fatal]
actions:
  - channel: teams
    target: "Production Alerts"

# Others to #dev
name: Dev Alerts
trigger: new_issue
conditions:
  levels: [error, warning]
actions:
  - channel: teams
    target: "Dev Team"
```

### Scheduled Digests

Send daily/weekly summaries:

1. Go to **Alerts** → **Digests**
2. Create a digest
3. Select Teams channel
4. Set frequency

## Multiple Teams

### Different Tenants

For different Teams tenants:

1. Create webhooks in each tenant
2. Add each as separate integration
3. Name clearly (e.g., "Teams - Company A")

### Single Tenant, Multiple Channels

1. Create webhooks for each channel
2. Add as separate integrations
3. Route alerts to appropriate channels

## Troubleshooting

### Webhook Not Working

1. Verify webhook URL is correct
2. Check webhook hasn't expired
3. Test with curl:
   ```bash
   curl -X POST -H "Content-Type: application/json" \
     -d '{"text": "Test message"}' \
     YOUR_WEBHOOK_URL
   ```

### Rate Limits

If hitting rate limits:
1. Reduce alert frequency
2. Enable aggregation
3. Use digests

### Card Not Rendering

1. Check Teams channel supports Adaptive Cards
2. Verify JSON payload is valid
3. Contact support if issue persists

## Security

### Webhook Security

- Webhook URLs are stored encrypted
- URLs are not exposed in logs
- Rotate webhooks periodically

### Data in Teams

Alerts include:
- Error summary
- Location
- Event counts

Alerts do NOT include:
- Full stack traces
- Request/response data
- User PII

## Best Practices

### Channel Organization

```
#nadi-critical     - P1 alerts, immediate response
#nadi-production   - All production errors
#nadi-staging      - Staging errors
#nadi-reports      - Weekly digests
```

### Alert Hygiene

1. Don't over-alert (causes fatigue)
2. Use appropriate channels
3. Review and tune rules regularly

## Next Steps

- [Alert Rules](/platform/alerts/rules) - Configure rules
- [Slack](/platform/alerts/slack) - Slack integration
- [Webhooks](/platform/alerts/webhooks) - Custom integrations
