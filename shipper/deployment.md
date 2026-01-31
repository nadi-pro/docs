# Shipper Deployment

Deploy Shipper in production environments.

## systemd (Linux)

### Service File

Create `/etc/systemd/system/shipper.service`:

```ini
[Unit]
Description=Nadi Shipper Agent
After=network.target

[Service]
Type=simple
User=shipper
Group=shipper
ExecStart=/usr/local/bin/shipper --config=/opt/nadi-pro/shipper/nadi.yaml --record
Restart=always
RestartSec=10

# Logging
StandardOutput=append:/var/log/shipper.log
StandardError=append:/var/log/shipper.log

# Security
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/log/nadi /opt/nadi-pro/shipper

[Install]
WantedBy=multi-user.target
```

### Create User

```bash
sudo useradd --system --no-create-home shipper
sudo chown -R shipper:shipper /opt/nadi-pro/shipper
```

### Enable Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable shipper
sudo systemctl start shipper
```

### Manage Service

```bash
# Check status
sudo systemctl status shipper

# View logs
sudo journalctl -u shipper -f

# Restart
sudo systemctl restart shipper

# Stop
sudo systemctl stop shipper
```

## supervisord

### Configuration

Create `/etc/supervisor/conf.d/shipper.conf`:

```ini
[program:shipper]
command=/usr/local/bin/shipper --config="/opt/nadi-pro/shipper/nadi.yaml" --record
directory=/
redirect_stderr=true
autostart=true
autorestart=true
user=shipper
numprocs=1
process_name=%(program_name)s_%(process_num)s
```

### Multiple Applications

```ini
[program:shipper-app1]
command=/usr/local/bin/shipper --config="/opt/nadi-pro/shipper/app1.yaml" --record
directory=/
redirect_stderr=true
autostart=true
autorestart=true
user=shipper
numprocs=1
process_name=%(program_name)s_%(process_num)s

[program:shipper-app2]
command=/usr/local/bin/shipper --config="/opt/nadi-pro/shipper/app2.yaml" --record
directory=/
redirect_stderr=true
autostart=true
autorestart=true
user=shipper
numprocs=1
process_name=%(program_name)s_%(process_num)s
```

### Manage with supervisord

```bash
# Reload configuration
sudo supervisorctl reread
sudo supervisorctl update

# Start/stop
sudo supervisorctl start shipper
sudo supervisorctl stop shipper
sudo supervisorctl restart shipper

# Check status
sudo supervisorctl status shipper
```

## Docker

### Dockerfile

```dockerfile
FROM alpine:3.19

RUN apk add --no-cache ca-certificates

COPY shipper /usr/local/bin/shipper
RUN chmod +x /usr/local/bin/shipper

ENTRYPOINT ["/usr/local/bin/shipper"]
CMD ["--record"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    image: your-app:latest
    volumes:
      - nadi-logs:/var/log/nadi

  shipper:
    image: nadipro/shipper:latest
    restart: unless-stopped
    volumes:
      - nadi-logs:/var/log/nadi:ro
      - ./nadi.yaml:/etc/nadi/nadi.yaml:ro
    command: ["--config=/etc/nadi/nadi.yaml", "--record"]

volumes:
  nadi-logs:
```

### Docker with Network

```yaml
version: '3.8'

services:
  shipper:
    image: nadipro/shipper:latest
    restart: unless-stopped
    networks:
      - nadi
    volumes:
      - /var/log/nadi:/var/log/nadi:ro
      - ./nadi.yaml:/etc/nadi/nadi.yaml:ro

networks:
  nadi:
    external: true
```

## Kubernetes

### ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: shipper-config
data:
  nadi.yaml: |
    nadi:
      endpoint: https://nadi.pro/api/
      apiKey: ${NADI_API_KEY}
      token: ${NADI_APP_KEY}
      storage: /var/log/nadi
```

### Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: nadi-credentials
type: Opaque
stringData:
  api-key: your-api-key
  app-key: your-app-key
```

### Sidecar Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: app
          image: my-app:latest
          volumeMounts:
            - name: nadi-logs
              mountPath: /var/log/nadi

        - name: shipper
          image: nadipro/shipper:latest
          args: ["--config=/etc/nadi/nadi.yaml", "--record"]
          env:
            - name: NADI_API_KEY
              valueFrom:
                secretKeyRef:
                  name: nadi-credentials
                  key: api-key
            - name: NADI_APP_KEY
              valueFrom:
                secretKeyRef:
                  name: nadi-credentials
                  key: app-key
          volumeMounts:
            - name: nadi-logs
              mountPath: /var/log/nadi
              readOnly: true
            - name: shipper-config
              mountPath: /etc/nadi

      volumes:
        - name: nadi-logs
          emptyDir: {}
        - name: shipper-config
          configMap:
            name: shipper-config
```

### DaemonSet

For cluster-wide deployment:

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: shipper
spec:
  selector:
    matchLabels:
      app: shipper
  template:
    metadata:
      labels:
        app: shipper
    spec:
      containers:
        - name: shipper
          image: nadipro/shipper:latest
          args: ["--config=/etc/nadi/nadi.yaml", "--record"]
          volumeMounts:
            - name: nadi-logs
              mountPath: /var/log/nadi
              readOnly: true
            - name: shipper-config
              mountPath: /etc/nadi
      volumes:
        - name: nadi-logs
          hostPath:
            path: /var/log/nadi
        - name: shipper-config
          configMap:
            name: shipper-config
```

## launchd (macOS)

### Plist File

Create `~/Library/LaunchAgents/pro.nadi.shipper.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>pro.nadi.shipper</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/shipper</string>
        <string>--config=/usr/local/nadi-pro/shipper/nadi.yaml</string>
        <string>--record</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardOutPath</key>
    <string>/var/log/shipper.log</string>
    <key>StandardErrorPath</key>
    <string>/var/log/shipper.log</string>
</dict>
</plist>
```

### Load Service

```bash
launchctl load ~/Library/LaunchAgents/pro.nadi.shipper.plist
```

### Manage

```bash
# Start
launchctl start pro.nadi.shipper

# Stop
launchctl stop pro.nadi.shipper

# Unload
launchctl unload ~/Library/LaunchAgents/pro.nadi.shipper.plist
```

## Windows Service

### Install as Service

```powershell
# Using NSSM (Non-Sucking Service Manager)
nssm install Shipper "C:\Program Files\Nadi-Pro\Shipper\shipper.exe"
nssm set Shipper AppParameters "--config=C:\ProgramData\Nadi-Pro\Shipper\nadi.yaml --record"
nssm set Shipper AppDirectory "C:\Program Files\Nadi-Pro\Shipper"
nssm set Shipper Start SERVICE_AUTO_START
```

### Manage Service

```powershell
# Start
net start Shipper

# Stop
net stop Shipper

# Check status
sc query Shipper
```

## Health Checks

### HTTP Health Endpoint

Shipper can expose a health endpoint:

```yaml
nadi:
  healthCheck:
    enabled: true
    port: 8080
```

```bash
curl http://localhost:8080/health
```

### Kubernetes Probes

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 30

readinessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 10
```

## Next Steps

- [Configuration](/shipper/configuration) - Configuration reference
- [Troubleshooting](/shipper/troubleshooting) - Common issues
