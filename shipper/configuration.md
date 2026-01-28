# Shipper Configuration

Complete configuration reference for the Nadi Shipper agent.

## Configuration File

The configuration file is `nadi.yaml`. Location varies by OS:

| OS | Default Location |
|----|------------------|
| Linux | `/opt/nadi-pro/shipper/nadi.yaml` |
| macOS | `/usr/local/nadi-pro/shipper/nadi.yaml` |
| Windows | `C:\ProgramData\Nadi-Pro\Shipper\nadi.yaml` |

## Configuration Reference

```yaml
###################### Nadi Configuration ##################################

nadi:
  #--------------------------------------------------------------------------
  # API Configuration
  #--------------------------------------------------------------------------

  # Nadi API endpoint
  endpoint: https://nadi.pro/api/

  # Accept header for API versioning
  accept: application/vnd.nadi.v1+json

  # Your Nadi API key (required)
  apiKey: your-api-key-here

  # Your application token/key (required)
  token: your-application-key-here

  #--------------------------------------------------------------------------
  # Storage Configuration
  #--------------------------------------------------------------------------

  # Path to the log directory
  # This should match your SDK's storage path
  storage: /var/log/nadi

  # Path to the tracker file (relative to storage)
  # Tracks which logs have been sent
  trackerFile: tracker.json

  # Keep log files after sending (default: false)
  # Set to true for backup/debugging purposes
  persistent: false

  #--------------------------------------------------------------------------
  # Network Configuration
  #--------------------------------------------------------------------------

  # Maximum retry attempts for failed requests
  maxTries: 3

  # Request timeout
  timeout: 1m

  # Batch size (events per request)
  batchSize: 100

  # Flush interval (how often to send events)
  flushInterval: 10s

  #--------------------------------------------------------------------------
  # Advanced Configuration
  #--------------------------------------------------------------------------

  # Enable compression (gzip)
  compress: true

  # Log level: debug, info, warn, error
  logLevel: info

  # Enable verbose output
  verbose: false
```

## Required Settings

### API Key

Your Nadi API key for authentication:

```yaml
nadi:
  apiKey: nadi_api_xxxxxxxxxxxxxxxxxxxxx
```

Get your API key from [nadi.pro](https://nadi.pro) → Settings → API Tokens.

### Application Token

Your application key to identify the project:

```yaml
nadi:
  token: nadi_app_xxxxxxxxxxxxxxxxxxxxx
```

Get your app key from the application settings in Nadi.

### Storage Path

The directory where your SDK writes log files:

```yaml
nadi:
  storage: /var/log/nadi
```

This must match the `storage_path` configured in your SDK.

## Network Settings

### Timeout

Request timeout duration:

```yaml
nadi:
  timeout: 1m     # 1 minute
  timeout: 30s    # 30 seconds
  timeout: 2m30s  # 2 minutes 30 seconds
```

### Retries

Maximum retry attempts for failed requests:

```yaml
nadi:
  maxTries: 3
```

Retries use exponential backoff (1s, 2s, 4s, ...).

### Batch Size

Events per API request:

```yaml
nadi:
  batchSize: 100
```

Larger batches are more efficient but increase memory usage.

### Flush Interval

How often to send events:

```yaml
nadi:
  flushInterval: 10s
```

Shorter intervals mean faster delivery but more requests.

## Storage Settings

### Log Directory

```yaml
nadi:
  storage: /var/log/nadi
```

Shipper monitors this directory for log files matching `nadi-*.log`.

### Progress Tracking

Shipper tracks what's been sent in a tracker file:

```yaml
nadi:
  trackerFile: tracker.json  # Relative to storage path
```

This allows Shipper to resume after restarts without re-sending events.

### Log Retention

Control whether logs are deleted after sending:

```yaml
nadi:
  persistent: false  # Delete after sending (default)
  persistent: true   # Keep logs after sending
```

## Multiple Applications

### Same Server, Different Apps

Run multiple Shipper instances with different configs:

```bash
shipper --config /path/to/app1/nadi.yaml --record &
shipper --config /path/to/app2/nadi.yaml --record &
```

Each app needs:
1. Separate config file
2. Separate storage path
3. Different application key

### Example: App 1

```yaml
# /etc/nadi/app1.yaml
nadi:
  apiKey: your-api-key
  token: app1-token
  storage: /var/log/nadi/app1
  trackerFile: tracker-app1.json
```

### Example: App 2

```yaml
# /etc/nadi/app2.yaml
nadi:
  apiKey: your-api-key
  token: app2-token
  storage: /var/log/nadi/app2
  trackerFile: tracker-app2.json
```

## Environment Variables

Override config with environment variables:

```bash
export NADI_API_KEY=your-api-key
export NADI_TOKEN=your-app-key
export NADI_STORAGE=/var/log/nadi

shipper --record
```

| Variable | Config Key |
|----------|------------|
| `NADI_API_KEY` | `nadi.apiKey` |
| `NADI_TOKEN` | `nadi.token` |
| `NADI_STORAGE` | `nadi.storage` |
| `NADI_ENDPOINT` | `nadi.endpoint` |

## Command Line Options

```bash
shipper [options]

Options:
  --config PATH     Path to configuration file
  --record          Start shipping logs
  --test            Test connection and exit
  --validate        Validate configuration and exit
  --status          Show current status
  --version         Show version
  --verbose         Enable verbose output
  --help            Show help
```

### Examples

```bash
# Start with custom config
shipper --config /etc/nadi/custom.yaml --record

# Test connection
shipper --config /etc/nadi/nadi.yaml --test

# Validate configuration
shipper --config /etc/nadi/nadi.yaml --validate

# Verbose mode
shipper --record --verbose
```

## Logging

### Log Level

```yaml
nadi:
  logLevel: info  # debug, info, warn, error
```

### Log Output

By default, Shipper logs to stdout. Redirect in production:

```bash
shipper --record >> /var/log/shipper.log 2>&1
```

Or configure in systemd:

```ini
StandardOutput=append:/var/log/shipper.log
StandardError=append:/var/log/shipper.log
```

## Performance Tuning

### High Volume

For high-volume applications:

```yaml
nadi:
  batchSize: 500        # Larger batches
  flushInterval: 5s     # Faster flushing
  compress: true        # Enable compression
```

### Low Resource

For resource-constrained environments:

```yaml
nadi:
  batchSize: 50         # Smaller batches
  flushInterval: 30s    # Less frequent flushing
```

## Validation

### Validate Config

```bash
shipper --config nadi.yaml --validate
```

### Test Connection

```bash
shipper --config nadi.yaml --test
```

Output:
```
Testing configuration...
✓ Configuration valid
✓ Storage path accessible: /var/log/nadi
✓ API connection successful
✓ API key valid
✓ Application key valid
Ready to ship!
```

## Next Steps

- [Deployment](/shipper/deployment) - Production deployment
- [Troubleshooting](/shipper/troubleshooting) - Common issues
