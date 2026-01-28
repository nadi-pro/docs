# Alerts

Get notified when issues occur in your applications.

## Overview

Nadi's alerting system helps you:

- React quickly to new issues
- Track regressions
- Monitor performance degradation
- Stay informed without alert fatigue

## Alert Types

| Type | Description |
|------|-------------|
| **New Issue** | First occurrence of an error |
| **Regression** | Previously resolved issue reoccurs |
| **Spike** | Error rate exceeds threshold |
| **Performance** | Web Vitals degradation |
| **Threshold** | Custom metric threshold |

## Notification Channels

Send alerts to:

- [Slack](/platform/alerts/slack)
- [Microsoft Teams](/platform/alerts/teams)
- [Telegram](/platform/alerts/telegram)
- Email
- [Webhooks](/platform/alerts/webhooks)

## Quick Setup

### 1. Connect a Channel

Go to **Settings** → **Integrations** and connect your preferred channel.

### 2. Create an Alert Rule

Go to **Alerts** → **Rules** → **New Rule**:

| Field | Value |
|-------|-------|
| **When** | New Issue |
| **Project** | All Projects |
| **Environment** | Production |
| **Notify** | #alerts (Slack) |

### 3. Test the Alert

Click **Test** to send a sample notification.

## Alert Rules

### Rule Components

| Component | Description |
|-----------|-------------|
| **Trigger** | What causes the alert |
| **Conditions** | Filters to apply |
| **Actions** | What happens when triggered |
| **Schedule** | When alerts are active |

### Common Rules

**New Issues in Production**
```
Trigger: New Issue
Environment: Production
Action: Notify #production-alerts
```

**Error Spike**
```
Trigger: Error count > 100 in 5 minutes
Environment: All
Action: Notify #urgent-alerts
```

**Performance Regression**
```
Trigger: LCP p75 > 3s for 30 minutes
Environment: Production
Action: Notify #performance-alerts
```

## Alert Fatigue

### Best Practices

1. **Start with fewer alerts** - Add more as needed
2. **Use environments** - Less noise from dev/staging
3. **Set thresholds wisely** - Above normal baseline
4. **Group related alerts** - Don't flood channels
5. **Review regularly** - Tune or remove noisy rules

### Quiet Hours

Set times when non-critical alerts are paused:

1. Go to **Alerts** → **Settings**
2. Configure quiet hours (e.g., 10pm - 6am)
3. Select which rules to pause

### Escalation

Route critical alerts to on-call:

1. First notification → Team channel
2. No response in 15m → Direct message
3. No response in 30m → PagerDuty/Opsgenie

## Alert History

View past alerts:

- When triggered
- Who acknowledged
- Resolution time
- Related issues

## Next Steps

- [Alert Rules](/platform/alerts/rules) - Configure rules
- [Slack](/platform/alerts/slack) - Slack integration
- [Teams](/platform/alerts/teams) - Microsoft Teams
- [Webhooks](/platform/alerts/webhooks) - Custom integrations
