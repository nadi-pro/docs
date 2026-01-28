# Webhooks

Send Nadi alerts to any HTTP endpoint.

## Overview

Webhooks allow you to:

- Integrate with custom systems
- Trigger automated workflows
- Connect to unsupported platforms
- Build custom alerting logic

## Setup

### 1. Create Webhook

1. Go to **Settings** → **Integrations**
2. Click **Add Webhook**
3. Enter your webhook URL
4. Configure options
5. Click **Save**

### 2. Test

Click **Test** to send a sample payload.

## Webhook Configuration

### Basic Settings

| Setting | Description |
|---------|-------------|
| **URL** | Endpoint to receive alerts |
| **Method** | HTTP method (POST, PUT) |
| **Headers** | Custom headers to include |
| **Secret** | Signing secret for verification |

### Authentication

#### Bearer Token

```yaml
headers:
  Authorization: "Bearer your-token"
```

#### API Key

```yaml
headers:
  X-API-Key: "your-api-key"
```

#### Custom Header

```yaml
headers:
  X-Custom-Auth: "your-value"
```

## Payload Format

### Standard Payload

```json
{
  "event": "issue.new",
  "timestamp": "2024-01-15T10:30:00Z",
  "project": {
    "id": "abc123",
    "name": "my-app",
    "environment": "production"
  },
  "issue": {
    "id": "xyz789",
    "title": "TypeError: Cannot read property 'name' of undefined",
    "level": "error",
    "culprit": "app/services/UserService.php:45",
    "firstSeen": "2024-01-15T10:25:00Z",
    "lastSeen": "2024-01-15T10:30:00Z",
    "eventCount": 23,
    "userCount": 12,
    "url": "https://nadi.pro/issues/xyz789"
  },
  "event": {
    "id": "evt123",
    "message": "Cannot read property 'name' of undefined",
    "tags": {
      "environment": "production",
      "release": "1.2.3"
    }
  }
}
```

### Event Types

| Event | Description |
|-------|-------------|
| `issue.new` | New issue created |
| `issue.regression` | Resolved issue recurred |
| `issue.resolved` | Issue marked resolved |
| `issue.ignored` | Issue marked ignored |
| `issue.assigned` | Issue assigned to user |
| `alert.threshold` | Threshold exceeded |
| `alert.performance` | Performance degraded |

### Customizing Payload

Transform the payload to match your system:

```yaml
webhook:
  url: "https://api.example.com/alerts"
  transform:
    title: "{{ issue.title }}"
    severity: "{{ issue.level }}"
    link: "{{ issue.url }}"
```

## Signature Verification

### Verify Requests

Nadi signs webhooks with your secret:

```
X-Nadi-Signature: sha256=abc123...
```

### Verification Code

```python
import hmac
import hashlib

def verify_signature(payload, signature, secret):
    expected = 'sha256=' + hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
```

```javascript
const crypto = require('crypto')

function verifySignature(payload, signature, secret) {
  const expected =
    'sha256=' +
    crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  )
}
```

```php
function verifySignature($payload, $signature, $secret) {
    $expected = 'sha256=' . hash_hmac('sha256', $payload, $secret);
    return hash_equals($expected, $signature);
}
```

## Retry Behavior

### Automatic Retries

Failed webhooks are retried:

| Attempt | Delay |
|---------|-------|
| 1 | Immediate |
| 2 | 1 minute |
| 3 | 5 minutes |
| 4 | 30 minutes |
| 5 | 2 hours |

### Success Criteria

Webhook is considered successful when:
- HTTP status 2xx returned
- Response received within 30 seconds

### Failure Handling

After max retries:
- Webhook is disabled
- You receive notification
- Events are logged

## Integration Examples

### PagerDuty

```yaml
url: "https://events.pagerduty.com/v2/enqueue"
headers:
  Content-Type: "application/json"
transform:
  routing_key: "your-routing-key"
  event_action: "trigger"
  payload:
    summary: "{{ issue.title }}"
    severity: "critical"
    source: "nadi"
```

### Opsgenie

```yaml
url: "https://api.opsgenie.com/v2/alerts"
headers:
  Authorization: "GenieKey your-key"
transform:
  message: "{{ issue.title }}"
  priority: "P1"
  source: "Nadi"
```

### Discord

```yaml
url: "https://discord.com/api/webhooks/xxx/yyy"
transform:
  content: "🔴 **{{ issue.title }}**\n{{ issue.url }}"
```

### Custom API

```yaml
url: "https://api.yourcompany.com/incidents"
headers:
  Authorization: "Bearer {{ env.API_TOKEN }}"
  X-Source: "nadi"
transform:
  title: "{{ issue.title }}"
  severity: "{{ issue.level }}"
  service: "{{ project.name }}"
  details:
    url: "{{ issue.url }}"
    events: "{{ issue.eventCount }}"
```

## Testing

### Manual Test

1. Click **Test** on the webhook
2. Review the sent payload
3. Check your endpoint received it

### Debug Mode

Enable debug logging:

1. Go to webhook settings
2. Enable **Debug Mode**
3. View request/response logs

### Request Inspector

Use tools like:
- [RequestBin](https://requestbin.com)
- [Webhook.site](https://webhook.site)
- [ngrok](https://ngrok.com) for local testing

## Troubleshooting

### Webhook Not Firing

1. Check URL is correct
2. Verify endpoint is reachable
3. Check alert rules are active
4. Review webhook logs

### Invalid Signature

1. Verify secret matches
2. Check payload encoding
3. Ensure body isn't modified

### Timeouts

1. Optimize endpoint performance
2. Return 202 and process async
3. Check network connectivity

## Best Practices

### Security

1. Use HTTPS endpoints
2. Verify signatures
3. Rotate secrets periodically
4. Validate payload structure

### Reliability

1. Return 2xx quickly
2. Process async for heavy work
3. Implement idempotency
4. Log webhook receipts

### Performance

1. Respond within 30 seconds
2. Queue for processing
3. Handle retries gracefully

## Next Steps

- [Alert Rules](/platform/alerts/rules) - Configure rules
- [Slack](/platform/alerts/slack) - Slack integration
- [Teams](/platform/alerts/teams) - Teams integration
