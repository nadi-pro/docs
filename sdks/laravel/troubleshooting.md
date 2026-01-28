# Troubleshooting

Common issues and solutions for the Laravel SDK.

## Errors Not Appearing in Dashboard

### Check Nadi is Enabled

Verify Nadi is enabled in your environment:

```bash
php artisan tinker
>>> config('nadi.enabled')
=> true
```

If disabled, enable it:

```env
NADI_ENABLED=true
```

### Verify API Credentials

Test your credentials:

```bash
php artisan nadi:test
```

If credentials are invalid:

1. Log in to [nadi.pro](https://nadi.pro)
2. Verify your API Key in Settings → API Tokens
3. Verify your App Key in the application settings
4. Update your `.env` file

### Check Log File Creation

Verify logs are being written:

```bash
ls -la /var/log/nadi/
```

If the directory doesn't exist or is empty:

```bash
# Create the directory
sudo mkdir -p /var/log/nadi

# Set permissions
sudo chown www-data:www-data /var/log/nadi
sudo chmod 755 /var/log/nadi
```

### Check Shipper is Running

Verify Shipper is processing logs:

```bash
# Check Shipper status
shipper --status

# Check Shipper logs
tail -f /var/log/shipper.log
```

### Check Sampling Rate

Verify you're not sampling too aggressively:

```bash
php artisan tinker
>>> config('nadi.sampling.config.sampling_rate')
=> 1.0  # Should be > 0
```

Set to 100% for testing:

```env
NADI_SAMPLING_STRATEGY=fixed_rate
NADI_SAMPLING_RATE=1.0
```

## Permission Errors

### Log Directory Permissions

```bash
# Error: Unable to write to log file
# Solution:
sudo chown -R www-data:www-data /var/log/nadi
sudo chmod -R 755 /var/log/nadi
```

### SELinux (CentOS/RHEL)

If using SELinux:

```bash
# Allow Apache/Nginx to write to log directory
sudo semanage fcontext -a -t httpd_log_t "/var/log/nadi(/.*)?"
sudo restorecon -Rv /var/log/nadi
```

## Configuration Issues

### Config File Not Found

If changes aren't taking effect:

```bash
# Clear config cache
php artisan config:clear

# Republish config
php artisan vendor:publish --tag=nadi-config --force
```

### Environment Variables Not Loading

Check `.env` file is being read:

```bash
php artisan tinker
>>> env('NADI_API_KEY')
=> "your-key"  # Should show your key
```

If null, verify:

1. `.env` file exists in project root
2. No syntax errors in `.env`
3. Clear config cache: `php artisan config:clear`

## Exception Handler Issues

### Exceptions Not Being Reported

Verify the exception handler is registered. For Laravel 11+:

```php
// bootstrap/app.php
return Application::configure(basePath: dirname(__DIR__))
    ->withExceptions(function (Exceptions $exceptions) {
        // Nadi should be auto-registered
    })
    ->create();
```

For Laravel 9-10, check `app/Exceptions/Handler.php`:

```php
public function register()
{
    $this->reportable(function (Throwable $e) {
        if (app()->bound('nadi')) {
            app('nadi')->captureException($e);
        }
    });
}
```

### Exception in Don't Report List

Check if your exception type is being ignored:

```php
// config/nadi.php
'dont_report' => [
    // Your exception might be listed here
],
```

## Queue Job Issues

### Queue Exceptions Not Captured

Ensure queue exception capture is enabled:

```php
// config/nadi.php
'capture_queue_exceptions' => true,
```

### Context Lost in Jobs

Context set before dispatch isn't available in jobs. Set context within the job:

```php
class ProcessOrder implements ShouldQueue
{
    public function handle()
    {
        Nadi::setTag('job', 'process_order');
        // ... job logic
    }
}
```

## Memory Issues

### High Memory Usage

If Nadi is using too much memory:

1. **Reduce breadcrumb limit:**
```php
// config/nadi.php
'breadcrumbs' => [
    'max_breadcrumbs' => 50, // Default is 100
],
```

2. **Limit stack trace depth:**
```php
'max_stack_frames' => 30, // Default is 50
```

3. **Disable request body capture:**
```php
'capture_request_body' => false,
```

## Network Issues

### Timeout Errors (HTTP Transporter)

If using HTTP transporter directly:

```php
// config/nadi.php
'http' => [
    'timeout' => 10, // Increase timeout
],
```

### SSL/TLS Errors

Verify SSL certificates:

```bash
curl -v https://nadi.pro/api/health
```

If certificate issues, ensure CA certificates are up to date:

```bash
# Ubuntu/Debian
sudo apt-get update && sudo apt-get install ca-certificates

# CentOS/RHEL
sudo yum update ca-certificates
```

## Common Error Messages

### "Invalid API Key"

- Verify the API key is correct
- Check for whitespace in `.env`
- Ensure the key hasn't been regenerated

### "Application Not Found"

- Verify the App Key is correct
- Check the application hasn't been deleted
- Ensure you're using the right environment's key

### "Rate Limit Exceeded"

- Implement sampling to reduce volume
- Check for error loops
- Contact support for rate limit increase

### "Storage Path Not Writable"

```bash
# Fix permissions
sudo chown www-data:www-data /var/log/nadi
sudo chmod 755 /var/log/nadi
```

## Debugging Steps

### 1. Enable Debug Mode

```php
// config/nadi.php
'debug' => true,
```

### 2. Check Laravel Logs

```bash
tail -f storage/logs/laravel.log | grep -i nadi
```

### 3. Verify Installation

```bash
composer show nadi-pro/nadi-laravel
```

### 4. Test Manually

```php
// In tinker or a route
use Nadi\Laravel\Facades\Nadi;

Nadi::captureMessage('Debug test');

// Check log file
$log = file_get_contents('/var/log/nadi/nadi-' . date('Y-m-d') . '.log');
dump($log);
```

### 5. Verify Event Format

```php
$event = json_decode(file_get_contents('/var/log/nadi/nadi-' . date('Y-m-d') . '.log'), true);
dump($event);
```

## Getting Help

If you're still having issues:

1. **Check documentation:** Review the relevant section
2. **Search issues:** [GitHub Issues](https://github.com/nadi-pro/nadi-laravel/issues)
3. **Contact support:** [tech@nadi.pro](mailto:tech@nadi.pro)

When contacting support, include:

- Laravel version
- PHP version
- Nadi package version
- Error messages
- Steps to reproduce
- Relevant configuration (redact API keys)
