# Transporters

Transporters determine how events are sent from your application to Nadi.

## Available Transporters

| Transporter | Description | Use Case |
|-------------|-------------|----------|
| `file` | Write to local log files | Production (recommended) |
| `http` | Send directly via HTTP | Simple setups, testing |

## File Transporter (Recommended)

The file transporter writes events to local log files. The Shipper agent then reads these files and sends them to Nadi.

### Why File Transport?

- **Non-blocking** - Writing to files is fast
- **Resilient** - Events are queued locally if network is unavailable
- **No request overhead** - Doesn't add latency to your application
- **Reliable** - Shipper handles retries and delivery confirmation

### Configuration

```php
$client = new Client([
    'apiKey' => getenv('NADI_API_KEY'),
    'appKey' => getenv('NADI_APP_KEY'),
    'transporter' => 'file',
    'storagePath' => '/var/log/nadi',
]);
```

### Log File Format

Events are written as JSON, one per line:

```json
{"type":"exception","message":"Error occurred","timestamp":"2024-01-15T10:30:00Z",...}
{"type":"exception","message":"Another error","timestamp":"2024-01-15T10:31:00Z",...}
```

### Log File Naming

Files are named by date: `nadi-YYYY-MM-DD.log`

```
/var/log/nadi/
├── nadi-2024-01-15.log
├── nadi-2024-01-14.log
└── nadi-2024-01-13.log
```

### Directory Setup

Ensure the directory exists and is writable:

```bash
sudo mkdir -p /var/log/nadi
sudo chown www-data:www-data /var/log/nadi
sudo chmod 755 /var/log/nadi
```

### Log Rotation

Shipper handles cleanup of old logs. Configure in `nadi.yaml`:

```yaml
nadi:
  persistent: false  # Delete logs after sending
```

Or keep logs for backup:

```yaml
nadi:
  persistent: true  # Keep logs after sending
```

## HTTP Transporter

The HTTP transporter sends events directly to Nadi via HTTP requests.

### Configuration

```php
$client = new Client([
    'apiKey' => getenv('NADI_API_KEY'),
    'appKey' => getenv('NADI_APP_KEY'),
    'transporter' => 'http',
    'endpoint' => 'https://nadi.pro/api/',
    'timeout' => 5,
]);
```

### When to Use HTTP Transport

- **Testing** - Quick setup without Shipper
- **Serverless** - Lambda, Cloud Functions
- **Low volume** - Few events per day
- **Simple deployments** - Single server, simple setup

### Limitations

- **Blocking** - Adds latency to requests
- **No retry** - Failed requests are lost
- **Network dependent** - Fails if network is down

### Timeout Configuration

```php
[
    'timeout' => 5,        // Connection timeout (seconds)
    'connectTimeout' => 2, // TCP connect timeout (seconds)
]
```

## Custom Transporters

Create custom transporters for special requirements.

### Interface

```php
<?php

namespace Nadi\Transport;

interface TransporterInterface
{
    public function send(array $event): bool;
    public function flush(): void;
}
```

### Example: Queue Transporter

Send events via a message queue:

```php
<?php

namespace App\Nadi;

use Nadi\Transport\TransporterInterface;

class QueueTransporter implements TransporterInterface
{
    private $queue;

    public function __construct($queueConnection)
    {
        $this->queue = $queueConnection;
    }

    public function send(array $event): bool
    {
        return $this->queue->push('nadi_events', json_encode($event));
    }

    public function flush(): void
    {
        // Flush the queue buffer if needed
    }
}
```

### Registration

```php
use App\Nadi\QueueTransporter;

$transporter = new QueueTransporter($redisConnection);

$client = new Client([
    'apiKey' => getenv('NADI_API_KEY'),
    'appKey' => getenv('NADI_APP_KEY'),
]);

$client->setTransporter($transporter);
```

### Example: Multi Transporter

Send to multiple destinations:

```php
<?php

namespace App\Nadi;

use Nadi\Transport\TransporterInterface;

class MultiTransporter implements TransporterInterface
{
    private array $transporters;

    public function __construct(array $transporters)
    {
        $this->transporters = $transporters;
    }

    public function send(array $event): bool
    {
        $success = true;
        foreach ($this->transporters as $transporter) {
            if (!$transporter->send($event)) {
                $success = false;
            }
        }
        return $success;
    }

    public function flush(): void
    {
        foreach ($this->transporters as $transporter) {
            $transporter->flush();
        }
    }
}
```

## Transporter Comparison

| Feature | File | HTTP |
|---------|------|------|
| Latency Impact | None | ~50-500ms |
| Reliability | High | Medium |
| Network Required | No (at capture) | Yes |
| Requires Shipper | Yes | No |
| Retry on Failure | Yes (via Shipper) | No |
| Batch Processing | Yes | No |
| Offline Support | Yes | No |

## Troubleshooting

### File Transporter Issues

**Permission denied:**
```bash
sudo chown www-data:www-data /var/log/nadi
sudo chmod 755 /var/log/nadi
```

**Disk full:**
```bash
# Check disk space
df -h /var/log/nadi

# Check log size
du -sh /var/log/nadi/*
```

**Logs not being sent:**
- Verify Shipper is running
- Check Shipper configuration
- Review Shipper logs

### HTTP Transporter Issues

**Timeout errors:**
```php
[
    'timeout' => 10,  // Increase timeout
]
```

**SSL/TLS errors:**
```php
[
    'verifySsl' => true,  // Ensure certificates are valid
]
```

**Connection refused:**
- Check network connectivity
- Verify endpoint URL
- Check firewall rules

## Next Steps

- [Sampling](/sdks/php/sampling) - Control event volume
- [Advanced Usage](/sdks/php/advanced) - Advanced features
