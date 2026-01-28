# Quick Start

Get Nadi up and running in your application in under 5 minutes.

## Prerequisites

- A Nadi account at [nadi.pro](https://nadi.pro)
- An application created in the Nadi dashboard
- Your API Key and Application Key

## Step 1: Get Your Keys

1. Log in to the [Nadi Dashboard](https://nadi.pro)
2. Create a new application or select an existing one
3. Copy your **API Key** and **Application Key**

::: info
Your API Key authenticates requests to the Nadi API. Your Application Key identifies which application the errors belong to.
:::

## Step 2: Install the SDK

Choose the SDK for your platform:

::: code-group

```bash [Laravel]
composer require nadi-pro/nadi-laravel
php artisan nadi:install
```

```bash [PHP]
composer require nadi-pro/nadi-php
```

```bash [JavaScript]
npm install @nadi-pro/browser
```

```bash [WordPress]
# Download the latest release from:
# https://github.com/nadi-pro/nadi-wordpress/releases/latest
# Upload via WordPress > Plugins > Add New > Upload Plugin
```

:::

## Step 3: Configure the SDK

::: code-group

```env [Laravel]
NADI_API_KEY=your-api-key
NADI_APP_KEY=your-application-key
```

```php [PHP]
<?php
use Nadi\Client;

$client = new Client([
    'apiKey' => 'your-api-key',
    'appKey' => 'your-application-key',
]);
```

```javascript [JavaScript]
import { init } from '@nadi-pro/browser'

init({
  apiKey: 'your-api-key',
  appKey: 'your-application-key',
})
```

```text [WordPress]
Navigate to Settings > Nadi in WordPress admin
Enter your API Key and Application Key
Click "Save Changes"
```

:::

## Step 4: Install Shipper

The Shipper agent reads log files and sends them to Nadi. Install it on the same server as your application:

::: code-group

```bash [Linux & macOS]
sudo bash < <(curl -sL https://raw.githubusercontent.com/nadi-pro/shipper/master/install)
```

```powershell [Windows]
powershell -command "(New-Object Net.WebClient).DownloadFile('https://raw.githubusercontent.com/nadi-pro/shipper/master/install.ps1', '%TEMP%\install.ps1') && %TEMP%\install.ps1 && del %TEMP%\install.ps1"
```

:::

### Configure Shipper

Edit the Shipper configuration file:

| OS | Location |
|----|----------|
| Linux | `/opt/nadi-pro/shipper/nadi.yaml` |
| macOS | `/usr/local/nadi-pro/shipper/nadi.yaml` |
| Windows | `C:\ProgramData\Nadi-Pro\Shipper\nadi.yaml` |

```yaml
nadi:
  endpoint: https://nadi.pro/api/
  apiKey: your-api-key
  token: your-application-key
  storage: /var/log/nadi  # Path where your app writes logs
```

## Step 5: Test the Integration

Trigger a test error to verify everything is working:

::: code-group

```php [Laravel]
// In a route or controller
Route::get('/test-nadi', function () {
    throw new \Exception('Test error from Nadi integration');
});
```

```php [PHP]
<?php
throw new \Exception('Test error from Nadi integration');
```

```javascript [JavaScript]
// In your application code
throw new Error('Test error from Nadi integration')
```

```php [WordPress]
// In a plugin or theme
throw new Exception('Test error from Nadi integration');
```

:::

Check the Nadi dashboard - you should see the error appear within a few seconds!

## Next Steps

Now that you have Nadi set up, explore these features:

- **[Laravel SDK](/sdks/laravel/)** - Full Laravel integration guide
- **[PHP SDK](/sdks/php/)** - Core PHP SDK documentation
- **[JavaScript SDK](/sdks/javascript/)** - Browser SDK with Web Vitals
- **[Shipper Configuration](/shipper/configuration)** - Advanced Shipper options
- **[Sampling](/sdks/laravel/sampling)** - Control which errors are captured
- **[Alerts](/platform/alerts/)** - Set up notifications for critical errors

## Troubleshooting

### Errors not appearing in dashboard?

1. **Check log file permissions** - Ensure your app can write to the log directory
2. **Verify Shipper is running** - Run `shipper --status` to check
3. **Check API keys** - Ensure both API Key and App Key are correct
4. **Review Shipper logs** - Check for connection errors

### Need help?

- Check our [Troubleshooting Guide](/sdks/laravel/troubleshooting)
- Contact support at [tech@nadi.pro](mailto:tech@nadi.pro)
