# Telegram Integration

Receive Nadi alerts via Telegram.

## Setup

### 1. Create a Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. Follow prompts to name your bot
4. Copy the **bot token**

### 2. Get Chat ID

#### For Personal Alerts

1. Send a message to your bot
2. Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Find your `chat_id` in the response

#### For Group Alerts

1. Add the bot to your group
2. Send a message in the group mentioning the bot
3. Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
4. Find the group `chat_id` (negative number)

### 3. Add to Nadi

1. Go to **Settings** → **Integrations**
2. Click **Add Telegram**
3. Enter bot token
4. Enter chat ID
5. Click **Save**

### 4. Test

Click **Test** to send a test message.

## Notification Format

### Standard Alert

```
🔴 New Error in my-app

TypeError: Cannot read property 'name' of undefined

📍 app/services/UserService.php:45
📊 23 events | 12 users
🌍 production

🔗 View: https://nadi.pro/issues/abc123
```

### With Context

```
🔴 New Error in my-app

TypeError: Cannot read property 'name' of undefined

📍 Location: app/services/UserService.php:45
👤 User: john@example.com
🏷️ Tags: checkout, payment

📊 Events: 23
👥 Users: 12
🕐 First seen: 2 hours ago

🔗 https://nadi.pro/issues/abc123
```

## Features

### Inline Actions

Commands to interact with alerts:
- `/resolve abc123` - Resolve issue
- `/ignore abc123` - Ignore issue
- `/status` - View current status

### Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Initialize bot |
| `/status` | Current error summary |
| `/recent` | Recent issues |
| `/help` | Available commands |

### Formatting

Nadi uses Telegram's Markdown for formatting:
- **Bold** for emphasis
- `Code` for technical terms
- Links to dashboard

## Configuration

### Multiple Recipients

Send to multiple chats:

```yaml
actions:
  - channel: telegram
    target: "123456789"  # Personal
  - channel: telegram
    target: "-987654321" # Group
```

### Severity-Based Routing

```yaml
# Critical to on-call person
name: Critical Alerts
conditions:
  levels: [fatal]
actions:
  - channel: telegram
    target: "oncall_chat_id"

# Others to group
name: Team Alerts
conditions:
  levels: [error]
actions:
  - channel: telegram
    target: "group_chat_id"
```

### Quiet Hours

Respect quiet hours:

```yaml
schedule:
  type: hours
  hours:
    start: "08:00"
    end: "22:00"
  timezone: "Europe/London"
```

## Group Setup

### Adding Bot to Group

1. Create a Telegram group
2. Add your Nadi bot
3. Give admin rights (optional, for features)
4. Note the group chat ID

### Admin Rights

For full features, give bot admin rights:
- Pin messages (for critical alerts)
- Edit messages (for updates)

## Security

### Bot Token

- Keep token secret
- Rotate if compromised
- Use environment variables

### Chat IDs

- Verify chat IDs belong to you
- Group IDs start with `-`
- Don't share chat IDs publicly

## Troubleshooting

### Bot Not Sending

1. Verify bot token is correct
2. Check chat ID is correct
3. Ensure bot can message the chat
4. Test with curl:
   ```bash
   curl -X POST \
     "https://api.telegram.org/bot<TOKEN>/sendMessage" \
     -d "chat_id=<CHAT_ID>&text=Test"
   ```

### Can't Find Chat ID

1. Send message to bot (or mention in group)
2. Check getUpdates within 24 hours
3. Try using @RawDataBot to get ID

### Group Not Receiving

1. Ensure bot is in the group
2. Check group permissions allow bots
3. Verify group chat ID (should be negative)

## Best Practices

### Channel Organization

| Chat | Purpose |
|------|---------|
| Personal | On-call alerts |
| Team Group | General alerts |
| Ops Channel | Critical only |

### Alert Hygiene

1. Don't over-alert
2. Use severity filters
3. Leverage quiet hours
4. Consider digest mode

## Next Steps

- [Alert Rules](/platform/alerts/rules) - Configure rules
- [Slack](/platform/alerts/slack) - Slack integration
- [Webhooks](/platform/alerts/webhooks) - Custom integrations
