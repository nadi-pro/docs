# Testing

Test your Nadi integration and ensure errors are being captured correctly.

## Test Command

The Laravel SDK includes a test command to verify your configuration:

```bash
php artisan nadi:test
```

This command:

1. Validates your API credentials
2. Tests connectivity to Nadi
3. Sends a test exception
4. Verifies the log file was created
5. Confirms Shipper can access the log directory

### Expected Output

```
Nadi Configuration Test
=======================

✓ API Key is configured
✓ App Key is configured
✓ Storage path exists: /var/log/nadi
✓ Storage path is writable
✓ Test exception logged successfully

Test event written to: /var/log/nadi/nadi-2024-01-15.log

Next steps:
1. Ensure Shipper is running
2. Check the Nadi dashboard for the test event
```

## Manual Testing

### Trigger a Test Exception

Create a test route:

```php
// routes/web.php
Route::get('/test-nadi', function () {
    throw new \Exception('Test exception from Nadi');
});
```

Visit `/test-nadi` in your browser and check the Nadi dashboard.

### Test with Artisan

```bash
php artisan tinker
>>> throw new \Exception('Test from tinker');
```

### Test Manual Capture

```php
Route::get('/test-nadi-manual', function () {
    \Nadi\Laravel\Facades\Nadi::captureMessage('Test message', 'info');
    return 'Message sent!';
});
```

## Testing in PHPUnit

### Disable Nadi During Tests

Prevent test exceptions from being reported:

```php
// phpunit.xml
<env name="NADI_ENABLED" value="false"/>
```

Or in your test:

```php
// tests/TestCase.php
protected function setUp(): void
{
    parent::setUp();
    config(['nadi.enabled' => false]);
}
```

### Mock Nadi Facade

Test that your code calls Nadi correctly:

```php
use Nadi\Laravel\Facades\Nadi;

public function test_captures_exception_on_payment_failure()
{
    Nadi::shouldReceive('captureException')
        ->once()
        ->withArgs(function ($exception) {
            return $exception instanceof PaymentException;
        });

    $this->post('/checkout', $this->checkoutData())
        ->assertStatus(500);
}
```

### Test Context Is Set

```php
public function test_sets_user_context()
{
    Nadi::shouldReceive('setUser')
        ->once()
        ->with(\Mockery::on(function ($user) {
            return $user['id'] === 1 && isset($user['email']);
        }));

    $this->actingAs($this->user)
        ->get('/dashboard');
}
```

### Test Breadcrumbs

```php
public function test_adds_breadcrumb_on_order_create()
{
    Nadi::shouldReceive('addBreadcrumb')
        ->once()
        ->with('Order created', 'info', \Mockery::type('array'));

    $this->post('/orders', $this->orderData());
}
```

## Feature Tests

### Test Exception Handler Integration

```php
public function test_exceptions_are_reported_to_nadi()
{
    // Enable Nadi for this test
    config(['nadi.enabled' => true]);

    // Mock the Nadi client
    $mock = \Mockery::mock(\Nadi\Client::class);
    $mock->shouldReceive('captureException')->once();
    $this->app->instance(\Nadi\Client::class, $mock);

    // Trigger an exception
    $this->withoutExceptionHandling()
        ->expectException(\Exception::class);

    $this->get('/route-that-throws');
}
```

### Test Sampling

```php
public function test_sampling_respects_rate()
{
    config(['nadi.sampling.strategy' => 'fixed_rate']);
    config(['nadi.sampling.config.sampling_rate' => 0.0]); // 0% = no events

    Nadi::shouldReceive('captureException')->never();

    try {
        throw new \Exception('This should not be captured');
    } catch (\Exception $e) {
        app(\Nadi\Laravel\NadiHandler::class)->report($e);
    }
}
```

## Integration Tests

### Verify Log File Creation

```php
public function test_exception_creates_log_file()
{
    $logPath = config('nadi.storage_path');
    $logFile = $logPath . '/nadi-' . date('Y-m-d') . '.log';

    // Clear existing log
    if (file_exists($logFile)) {
        unlink($logFile);
    }

    // Trigger exception
    try {
        throw new \Exception('Test exception');
    } catch (\Exception $e) {
        app(\Nadi\Laravel\NadiHandler::class)->report($e);
    }

    $this->assertFileExists($logFile);

    // Verify log content
    $content = file_get_contents($logFile);
    $event = json_decode($content, true);

    $this->assertEquals('Test exception', $event['message']);
    $this->assertEquals('error', $event['level']);
}
```

### Test Log Format

```php
public function test_log_format_is_valid_json()
{
    // Trigger and capture log
    try {
        throw new \Exception('Test');
    } catch (\Exception $e) {
        app(\Nadi\Laravel\NadiHandler::class)->report($e);
    }

    $logFile = config('nadi.storage_path') . '/nadi-' . date('Y-m-d') . '.log';
    $lines = file($logFile, FILE_IGNORE_NEW_LINES);

    foreach ($lines as $line) {
        $this->assertJson($line, 'Each log line should be valid JSON');
    }
}
```

## Testing Custom Sampling

```php
public function test_custom_sampling_strategy()
{
    // Register custom strategy
    config(['nadi.sampling.strategies.test' => TestSamplingStrategy::class]);
    config(['nadi.sampling.strategy' => 'test']);

    // Your test assertions
}

class TestSamplingStrategy implements \Nadi\Sampling\Contract
{
    public function shouldSample(): bool
    {
        return true; // Always sample in tests
    }
}
```

## Debugging Tests

### Enable Debug Mode

```php
config(['nadi.debug' => true]);
```

### Check Log Output

```php
public function test_with_log_output()
{
    \Log::shouldReceive('debug')
        ->with(\Mockery::pattern('/Nadi: Event captured/'));

    // Your test code
}
```

### Dump Event Data

```php
Nadi::beforeCapture(function ($event, $hint) {
    dump($event); // See what's being captured
    return $event;
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'

      - name: Install dependencies
        run: composer install

      - name: Run tests
        run: vendor/bin/phpunit
        env:
          NADI_ENABLED: false
```

### Test with Real Credentials (Staging)

```yaml
      - name: Integration test
        if: github.ref == 'refs/heads/main'
        run: php artisan nadi:test
        env:
          NADI_API_KEY: ${{ secrets.NADI_STAGING_API_KEY }}
          NADI_APP_KEY: ${{ secrets.NADI_STAGING_APP_KEY }}
```

## Next Steps

- [Troubleshooting](/sdks/laravel/troubleshooting) - Debug integration issues
- [Configuration](/sdks/laravel/configuration) - Full configuration reference
