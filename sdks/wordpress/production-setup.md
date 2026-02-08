# Production Setup

Recommended configuration for running Nadi in a production WordPress environment.

## Cron Configuration

### Understanding WP-Cron

WordPress uses a pseudo-cron system — `wp-cron.php` runs scheduled tasks only when a page is visited. This means:

- **Low-traffic sites**: Cron tasks may be delayed for hours if no one visits
- **High-traffic sites**: Every page load checks for pending tasks, adding overhead

For reliable error delivery, replace WP-Cron with a real system cron job.

### Recommended: System Cron

#### Step 1: Disable WP-Cron

Add to `wp-config.php` (before `/* That's all, stop editing! */`):

```php
define('DISABLE_WP_CRON', true);
```

#### Step 2: Add System Cron Job

Run `crontab -e` and add one of the following:

**Using curl (most common):**

```bash
* * * * * curl -s https://your-site.com/wp-cron.php?doing_wp_cron > /dev/null 2>&1
```

**Using wget:**

```bash
* * * * * wget -q -O /dev/null https://your-site.com/wp-cron.php?doing_wp_cron 2>&1
```

**Using PHP CLI (no timeout limit):**

```bash
* * * * * cd /path/to/wordpress && php wp-cron.php doing_wp_cron > /dev/null 2>&1
```

**Using WP-CLI:**

```bash
* * * * * cd /path/to/wordpress && wp cron event run --due-now > /dev/null 2>&1
```

::: tip
`* * * * *` runs every minute. This ensures your exception logs are sent to Nadi within 1 minute of capture.
:::

#### Step 3: Verify

```bash
# Check if the Nadi cron event is scheduled
wp cron event list | grep nadi

# Expected output:
# send_nadi_log_event  nadi_every_minute  2026-02-08 20:30:00

# Manually run due events
wp cron event run --due-now

# Run Nadi event specifically
wp cron event run send_nadi_log_event
```

### Hosting-Specific Notes

| Hosting | Notes |
|---------|-------|
| **cPanel** | Use Cron Jobs under Advanced. Set `* * * * *` with the curl command. |
| **Plesk** | Go to Scheduled Tasks. Add new task with curl command. |
| **WP Engine** | WP-Cron is managed automatically. Contact support for custom intervals. |
| **Cloudways** | Use the Cron Job Manager in server management panel. |
| **VPS/Dedicated** | Use `crontab -e` as shown above. |
| **Docker** | Add cron to your container or use a sidecar container. |

## File Permissions

### Required Permissions

```bash
# Log directory — writable by web server
chmod 755 wp-content/plugins/nadi-wordpress/log/

# Config file — readable and writable by web server
chmod 644 wp-content/plugins/nadi-wordpress/config/nadi.yaml

# Shipper binary — executable
chmod 755 wp-content/plugins/nadi-wordpress/bin/shipper
```

### Verify Ownership

The web server user (typically `www-data`, `apache`, or `nginx`) must own or have write access to:

- `log/` — where JSON exception logs are written
- `config/` — where `nadi.yaml` is stored
- `bin/` — where the shipper binary lives

```bash
# Check current ownership
ls -la wp-content/plugins/nadi-wordpress/log/
ls -la wp-content/plugins/nadi-wordpress/config/
ls -la wp-content/plugins/nadi-wordpress/bin/

# Fix ownership if needed (adjust user to your web server user)
chown -R www-data:www-data wp-content/plugins/nadi-wordpress/log/
chown -R www-data:www-data wp-content/plugins/nadi-wordpress/config/
```

## Security

### Block Direct Access to Plugin Files

Prevent public access to configuration, logs, and binary files.

**Apache** — add to `.htaccess` in the plugin root:

```apache
<FilesMatch "\.(yaml|json|lock)$">
    Order deny,allow
    Deny from all
</FilesMatch>
```

**Nginx:**

```nginx
location ~* /wp-content/plugins/nadi-wordpress/(config|log|bin)/ {
    deny all;
    return 404;
}
```

### Security Checklist

- [ ] API key and application key are set
- [ ] `config/nadi.yaml` is not publicly accessible
- [ ] `log/` directory is not publicly accessible
- [ ] `tlsSkipVerify` is `false` (do not skip TLS verification in production)
- [ ] File permissions are restrictive (no world-writable files)

## Shipper Tuning

### High-Traffic Sites

```yaml
nadi:
  workers: 8          # Increase concurrent workers
  compress: true      # Reduce bandwidth usage
  persistent: true    # Reuse HTTP connections
  maxTries: 5         # More retry attempts
  timeout: "2m"       # Longer timeout for large batches
```

### Low-Resource Servers

```yaml
nadi:
  workers: 1          # Minimize CPU usage
  compress: false     # Skip compression overhead
  checkInterval: "30s" # Check less frequently
```

## Sampling for Production

| Strategy | Rate | Best For |
|----------|------|----------|
| `fixed_rate` | `1.0` | Development/staging — capture everything |
| `fixed_rate` | `0.1` | Production default — 10% sampling |
| `dynamic_rate` | auto | High-traffic — auto-adjusts based on load |
| `interval` | 60s | Consistent — one event per interval |

Configure via admin (**Settings** → **Nadi** → **Sampling** tab) or programmatically:

```php
update_option('nadi_sampling_strategy', 'fixed_rate');
update_option('nadi_sampling_rate', 0.5); // 50%
```

## Monitoring

### Check Plugin Health

Go to **Settings** → **Nadi** → **Status** tab:

- Shipper binary installation status
- API key and application key configured
- Test connection functionality

### CLI Monitoring

```bash
# Count pending log files
ls wp-content/plugins/nadi-wordpress/log/*.json 2>/dev/null | wc -l

# Check if lock file exists (shipper is currently running)
ls -la wp-content/plugins/nadi-wordpress/log/nadi.lock

# View PHP error log for Nadi messages
grep "Nadi" /var/log/php-error.log

# Check cron status
wp cron event list | grep nadi
```

### Manually Send Logs

```bash
# Via WP-CLI
wp cron event run send_nadi_log_event

# Via shipper binary directly
wp-content/plugins/nadi-wordpress/bin/shipper \
  --config=wp-content/plugins/nadi-wordpress/config/nadi.yaml \
  --record
```

## Next Steps

- [Configuration](/sdks/wordpress/configuration) - Full configuration reference
- [Error Tracking](/sdks/wordpress/error-tracking) - Advanced error tracking
