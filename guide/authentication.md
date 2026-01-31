# Authentication

Nadi uses two types of keys to authenticate requests and identify your applications.

## Key Types

### API Key

The **API Key** authenticates requests to the Nadi API. It's associated with your user account and should be kept secret.

**Characteristics:**
- Unique to your account
- Used by Shipper to authenticate API requests
- Should never be exposed in client-side code
- Can be regenerated (invalidates old key)

### Application Key (App Key)

The **Application Key** identifies which application the error data belongs to. Each application in Nadi has its own App Key.

**Characteristics:**
- Unique to each application/project
- Used by SDKs to tag events
- Can be used in client-side code (JavaScript SDK)
- Creates data isolation between projects

## Getting Your Keys

### Step 1: Create an Account

1. Go to [nadi.pro](https://nadi.pro)
2. Sign up for a new account or log in
3. Complete the onboarding process

### Step 2: Create Your API Key

1. Go to [API Tokens](https://nadi.pro/user/api-tokens)
2. Create a new API token
3. Copy your API Key

::: warning Keep Your API Key Secret
Your API Key has full access to your account. Never commit it to version control or expose it in client-side code.
:::

### Step 3: Create an Application

1. From the dashboard, click **New Application**
2. Enter your application name and details
3. Open the application page (e.g., `https://nadi.pro/applications/<your-app-uuid>`)
4. Copy the **Application Key** from the application details

### Step 4: Configure Your Environment

Store your keys securely using environment variables:

```bash
# .env file (never commit to git)
NADI_API_KEY=your-api-key-here
NADI_APP_KEY=your-application-key-here
```

## Using Keys in SDKs

### Laravel

The Laravel SDK reads keys from your `.env` file:

```env
NADI_API_KEY=nadi_api_xxxxxxxxxxxxx
NADI_APP_KEY=nadi_app_xxxxxxxxxxxxx
```

Or configure in `config/nadi.php`:

```php
return [
    'api_key' => env('NADI_API_KEY'),
    'app_key' => env('NADI_APP_KEY'),
];
```

### PHP

```php
use Nadi\Client;

$client = new Client([
    'apiKey' => getenv('NADI_API_KEY'),
    'appKey' => getenv('NADI_APP_KEY'),
]);
```

### JavaScript

For browser applications, only the App Key is needed:

```javascript
import { init } from '@nadi-pro/browser'

init({
  appKey: 'nadi_app_xxxxxxxxxxxxx',
  // API key is NOT used in browser SDK
})
```

::: info JavaScript SDK Security
The JavaScript SDK uses your App Key to identify events. It doesn't require your API Key because browser-side code cannot be secured. The Shipper agent handles API authentication when sending events to Nadi.
:::

### WordPress

1. Go to **Settings** → **Nadi** in WordPress admin
2. Enter both keys in the settings form
3. Click **Save Changes**

### Shipper

Configure keys in `nadi.yaml`:

```yaml
nadi:
  apiKey: nadi_api_xxxxxxxxxxxxx
  token: nadi_app_xxxxxxxxxxxxx  # This is your App Key
```

## Key Rotation

### Rotating Your API Key

If your API Key is compromised:

1. Go to [API Tokens](https://nadi.pro/user/api-tokens)
2. Click **Regenerate API Key**
3. Update all Shipper configurations with the new key
4. Restart Shipper instances

::: danger Immediate Invalidation
Regenerating your API Key immediately invalidates the old key. Update all configurations before regenerating to avoid service interruption.
:::

### Rotating Application Keys

Application keys can be rotated per-application:

1. Go to the application settings
2. Click **Regenerate App Key**
3. Update SDK and Shipper configurations
4. Redeploy your application

## Security Best Practices

### Do

- Store keys in environment variables
- Use separate applications for different environments (dev, staging, prod)
- Rotate keys periodically
- Use secrets management in CI/CD

### Don't

- Commit keys to version control
- Share API keys between team members
- Use production keys in development
- Log or print keys in error messages

## Environment Separation

Create separate applications for each environment:

| Environment | Application Name | Purpose |
|------------|------------------|---------|
| Development | `my-app-dev` | Local development |
| Staging | `my-app-staging` | QA and testing |
| Production | `my-app-prod` | Live environment |

This ensures:
- Development errors don't clutter production data
- Different alert configurations per environment
- Clear separation for debugging

## Troubleshooting

### "Invalid API Key" Error

- Verify the API key is correct
- Check for extra whitespace
- Ensure the key hasn't been regenerated
- Confirm you're using the right account

### "Application Not Found" Error

- Verify the Application Key is correct
- Ensure the application hasn't been deleted
- Check you're using the correct environment's key

### Shipper Connection Issues

1. Test connectivity:
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        https://nadi.pro/api/health
   ```

2. Verify YAML syntax:
   ```bash
   shipper --config /path/to/nadi.yaml --validate
   ```

## Next Steps

- [Quick Start](/guide/quick-start) - Complete the setup
- [Shipper Configuration](/shipper/configuration) - Configure the agent
- [SDK Documentation](/sdks/) - Integrate with your application
