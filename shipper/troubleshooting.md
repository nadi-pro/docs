# Shipper Troubleshooting

Common issues and solutions for the Nadi Shipper agent.

## Diagnostic Commands

### Check Version

```bash
shipper --version
```

### Validate Configuration

```bash
shipper --config /path/to/nadi.yaml --validate
```

### Test Connection

```bash
shipper --config /path/to/nadi.yaml --test
```

### Check Status

```bash
shipper --config /path/to/nadi.yaml --status
```

### Verbose Mode

```bash
shipper --config /path/to/nadi.yaml --record --verbose
```

## Common Issues

### Logs Not Being Sent

#### 1. Check Log Files Exist

```bash
ls -la /var/log/nadi/
```

Expected: Files like `nadi-2024-01-15.log`

If empty:
- Verify your SDK is writing logs
- Check SDK's `storage_path` matches Shipper's `storage`

#### 2. Check Shipper is Running

```bash
# systemd
systemctl status shipper

# supervisord
supervisorctl status shipper

# Process check
ps aux | grep shipper
```

#### 3. Check Configuration

```bash
shipper --config /path/to/nadi.yaml --validate
```

#### 4. Check Tracker File

```bash
cat /var/log/nadi/tracker.json
```

The tracker shows what's been processed.

### Permission Errors

#### "Permission denied" Reading Logs

```bash
# Check file permissions
ls -la /var/log/nadi/

# Fix permissions
sudo chown shipper:shipper /var/log/nadi
sudo chmod 755 /var/log/nadi
```

#### "Permission denied" Writing Tracker

```bash
# Shipper user needs write access
sudo chown shipper:shipper /var/log/nadi
```

#### SELinux Issues (RHEL/CentOS)

```bash
# Check SELinux status
getenforce

# Temporarily disable
sudo setenforce 0

# Permanent fix
sudo semanage fcontext -a -t var_log_t "/var/log/nadi(/.*)?"
sudo restorecon -Rv /var/log/nadi
```

### Connection Errors

#### "Connection refused"

1. Check network connectivity:
   ```bash
   curl -I https://nadi.pro/api/health
   ```

2. Check firewall:
   ```bash
   # Allow outbound HTTPS
   sudo ufw allow out 443/tcp
   ```

3. Check proxy settings:
   ```bash
   echo $HTTP_PROXY
   echo $HTTPS_PROXY
   ```

#### "Connection timeout"

Increase timeout in configuration:

```yaml
nadi:
  timeout: 2m  # Increase from default 1m
```

#### "SSL certificate error"

```bash
# Update CA certificates
sudo apt-get update && sudo apt-get install ca-certificates

# Or (CentOS)
sudo yum update ca-certificates
```

### Authentication Errors

#### "Invalid API Key"

1. Verify API key in configuration:
   ```yaml
   nadi:
     apiKey: your-api-key
   ```

2. Check for whitespace/formatting issues

3. Regenerate API key in Nadi dashboard

4. Test directly:
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
        https://nadi.pro/api/health
   ```

#### "Application Not Found"

1. Verify application key:
   ```yaml
   nadi:
     token: your-app-key
   ```

2. Check application exists in Nadi dashboard

3. Ensure app key matches the application

### Storage Path Issues

#### "Storage path not found"

```bash
# Create directory
sudo mkdir -p /var/log/nadi

# Set ownership
sudo chown www-data:www-data /var/log/nadi
```

#### "No logs found in storage"

1. Check SDK configuration matches:
   ```php
   // Laravel config/nadi.php
   'storage_path' => '/var/log/nadi',
   ```

2. Verify SDK is writing:
   ```bash
   # Trigger a test error, then check
   ls -la /var/log/nadi/
   ```

### Memory Issues

#### High Memory Usage

Reduce batch size:

```yaml
nadi:
  batchSize: 50  # Reduce from default 100
```

#### Out of Memory

1. Check for stuck processes:
   ```bash
   ps aux | grep shipper
   ```

2. Restart with limits:
   ```ini
   # systemd
   [Service]
   MemoryLimit=100M
   ```

### Duplicate Events

If you're seeing duplicate events:

1. Check tracker file:
   ```bash
   cat /var/log/nadi/tracker.json
   ```

2. Reset tracker:
   ```bash
   rm /var/log/nadi/tracker.json
   ```

   ::: warning
   This will re-send all existing logs
   :::

3. Clear old logs first:
   ```bash
   rm /var/log/nadi/nadi-*.log
   rm /var/log/nadi/tracker.json
   ```

### Service Won't Start

#### systemd

```bash
# Check status
systemctl status shipper

# Check logs
journalctl -u shipper -n 50

# Common fixes
sudo systemctl daemon-reload
sudo systemctl restart shipper
```

#### supervisord

```bash
# Check status
supervisorctl status shipper

# Check logs
tail -f /var/log/shipper.log

# Restart
supervisorctl restart shipper
```

## Log Analysis

### Check Shipper Logs

```bash
# systemd
journalctl -u shipper -f

# supervisord
tail -f /var/log/shipper.log

# Manual
tail -f /var/log/shipper.log
```

### Common Log Messages

| Message | Meaning | Action |
|---------|---------|--------|
| `Starting shipper...` | Normal startup | None |
| `Connected to Nadi` | Connection successful | None |
| `Batch sent: 100 events` | Events delivered | None |
| `Retry attempt 1/3` | Temporary network issue | Wait |
| `Authentication failed` | Bad credentials | Check keys |
| `Storage path not accessible` | Permission issue | Fix permissions |

### Enable Debug Logging

```yaml
nadi:
  logLevel: debug
  verbose: true
```

Or via command line:

```bash
shipper --record --verbose
```

## Performance Issues

### Slow Delivery

1. Increase batch size:
   ```yaml
   nadi:
     batchSize: 200
   ```

2. Decrease flush interval:
   ```yaml
   nadi:
     flushInterval: 5s
   ```

3. Enable compression:
   ```yaml
   nadi:
     compress: true
   ```

### High CPU Usage

1. Increase flush interval:
   ```yaml
   nadi:
     flushInterval: 30s
   ```

2. Reduce verbose logging:
   ```yaml
   nadi:
     logLevel: warn
     verbose: false
   ```

## Getting Help

If you're still having issues:

1. **Collect diagnostics:**
   ```bash
   shipper --version
   shipper --config /path/to/nadi.yaml --validate
   shipper --config /path/to/nadi.yaml --test
   ls -la /var/log/nadi/
   cat /var/log/nadi/tracker.json
   ```

2. **Check logs:**
   ```bash
   journalctl -u shipper -n 100
   ```

3. **Contact support:**
   Email [tech@nadi.pro](mailto:tech@nadi.pro) with:
   - OS and version
   - Shipper version
   - Configuration (redact keys)
   - Error messages
   - Log output
