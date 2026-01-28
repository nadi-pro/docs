# Alert Rules

Configure when and how you receive notifications.

## Creating Rules

### Navigate to Rules

1. Go to **Alerts** → **Rules**
2. Click **New Rule**

### Rule Builder

| Section | Field | Value |
|---------|-------|-------|
| **Name** | | Production Error Alerts |
| **When** | Trigger | A new issue is created |
| **Conditions** | Project | My Production App |
| | Environment | production |
| | Level | error, fatal |
| **Actions** | Send to | #prod-alerts (Slack) |
| **Schedule** | Active | Always |

## Trigger Types

### New Issue

Alert when a never-seen-before error occurs.

```yaml
trigger: new_issue
```

Best for: Catching new bugs immediately

### Issue Regression

Alert when a resolved issue reoccurs.

```yaml
trigger: regression
```

Best for: Catching bugs that return after being fixed

### Error Count Threshold

Alert when error count exceeds threshold.

```yaml
trigger: threshold
metric: error_count
operator: greater_than
value: 100
window: 5m
```

Best for: Detecting error spikes

### Error Rate Threshold

Alert when error rate exceeds threshold.

```yaml
trigger: threshold
metric: error_rate
operator: greater_than
value: 5  # percent
window: 15m
```

Best for: Relative error detection

### Unique Users Affected

Alert when errors affect many users.

```yaml
trigger: threshold
metric: affected_users
operator: greater_than
value: 50
window: 1h
```

Best for: High-impact issue detection

### Performance Degradation

Alert when Web Vitals degrade.

```yaml
trigger: performance
metric: lcp_p75
operator: greater_than
value: 3000  # ms
window: 30m
```

Best for: Performance monitoring

## Conditions

### Project

Limit to specific projects:

```yaml
conditions:
  project: my-production-app
```

Or multiple projects:

```yaml
conditions:
  projects:
    - app-frontend
    - app-backend
```

### Environment

Limit to specific environments:

```yaml
conditions:
  environment: production
```

### Error Level

Limit to specific severity:

```yaml
conditions:
  levels:
    - error
    - fatal
```

### Tags

Match specific tags:

```yaml
conditions:
  tags:
    feature: checkout
    payment_gateway: stripe
```

### Issue Attributes

Match issue properties:

```yaml
conditions:
  issue:
    handled: false  # Only unhandled errors
    first_seen_within: 24h  # Only recent issues
```

## Actions

### Notification Channels

Send to configured channels:

```yaml
actions:
  - channel: slack
    target: "#production-alerts"
  - channel: email
    target: "team@example.com"
```

### Multiple Actions

Send to multiple destinations:

```yaml
actions:
  - channel: slack
    target: "#alerts"
  - channel: teams
    target: "Error Notifications"
  - channel: webhook
    target: "https://api.example.com/alerts"
```

### Action Options

Configure how notifications appear:

```yaml
actions:
  - channel: slack
    target: "#alerts"
    options:
      mention: "@oncall"
      thread: true
```

## Schedule

### Always Active

```yaml
schedule: always
```

### Business Hours

```yaml
schedule:
  type: hours
  timezone: America/New_York
  hours:
    start: "09:00"
    end: "18:00"
  days:
    - monday
    - tuesday
    - wednesday
    - thursday
    - friday
```

### Custom Schedule

```yaml
schedule:
  type: custom
  windows:
    - start: "2024-01-01T00:00:00Z"
      end: "2024-01-02T00:00:00Z"
```

## Rate Limiting

Prevent alert floods:

```yaml
rate_limit:
  max_alerts: 10
  window: 1h
  action: aggregate  # or "drop"
```

## Examples

### Critical Production Errors

```yaml
name: Critical Production Errors
trigger: new_issue
conditions:
  environment: production
  levels: [error, fatal]
actions:
  - channel: slack
    target: "#critical-alerts"
    options:
      mention: "@oncall"
  - channel: pagerduty
    target: production-service
schedule: always
```

### Error Spike Detection

```yaml
name: Error Spike Detection
trigger: threshold
metric: error_count
operator: greater_than
value: 50
window: 5m
conditions:
  environment: production
actions:
  - channel: slack
    target: "#monitoring"
rate_limit:
  max_alerts: 3
  window: 1h
```

### Performance Alerts

```yaml
name: LCP Degradation
trigger: performance
metric: lcp_p75
operator: greater_than
value: 3000
window: 30m
conditions:
  environment: production
actions:
  - channel: slack
    target: "#performance"
schedule:
  type: hours
  hours:
    start: "06:00"
    end: "22:00"
```

### User Impact Alert

```yaml
name: High User Impact
trigger: threshold
metric: affected_users
operator: greater_than
value: 100
window: 1h
conditions:
  environment: production
actions:
  - channel: email
    target: "leadership@example.com"
  - channel: slack
    target: "#incidents"
```

## Testing Rules

Test before activating:

1. Click **Test** on the rule
2. Review sample notification
3. Adjust as needed
4. Enable the rule

## Managing Rules

### Enable/Disable

Toggle rules on/off without deleting.

### Clone

Duplicate a rule to create variations.

### History

View when rule triggered and what was sent.

## Next Steps

- [Slack](/platform/alerts/slack) - Slack setup
- [Teams](/platform/alerts/teams) - Teams setup
- [Webhooks](/platform/alerts/webhooks) - Custom integrations
