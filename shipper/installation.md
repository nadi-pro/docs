# Shipper Installation

Detailed installation guide for the Nadi Shipper agent.

## Linux & macOS

### Automatic Installation

The easiest way to install Shipper:

```bash
sudo bash < <(curl -sL https://raw.githubusercontent.com/nadi-pro/shipper/master/install)
```

This script:
1. Detects your OS and architecture
2. Downloads the appropriate binary
3. Installs to the correct location
4. Creates the configuration directory
5. Copies the default configuration

### Installation Locations

| OS | Binary | Config |
|----|--------|--------|
| Linux | `/usr/local/bin/shipper` | `/opt/nadi-pro/shipper/` |
| macOS | `/usr/local/bin/shipper` | `/usr/local/nadi-pro/shipper/` |

### Manual Installation

1. Download the latest release:

```bash
# Linux x64
curl -LO https://github.com/nadi-pro/shipper/releases/latest/download/shipper-linux-amd64.tar.gz

# Linux ARM64
curl -LO https://github.com/nadi-pro/shipper/releases/latest/download/shipper-linux-arm64.tar.gz

# macOS Intel
curl -LO https://github.com/nadi-pro/shipper/releases/latest/download/shipper-darwin-amd64.tar.gz

# macOS Apple Silicon
curl -LO https://github.com/nadi-pro/shipper/releases/latest/download/shipper-darwin-arm64.tar.gz
```

2. Extract and install:

```bash
tar -xzf shipper-*.tar.gz
sudo mv shipper /usr/local/bin/
sudo chmod +x /usr/local/bin/shipper
```

3. Create config directory:

```bash
# Linux
sudo mkdir -p /opt/nadi-pro/shipper

# macOS
sudo mkdir -p /usr/local/nadi-pro/shipper
```

4. Create configuration file:

```bash
# Linux
sudo curl -o /opt/nadi-pro/shipper/nadi.yaml \
  https://raw.githubusercontent.com/nadi-pro/shipper/master/nadi.reference.yaml

# macOS
sudo curl -o /usr/local/nadi-pro/shipper/nadi.yaml \
  https://raw.githubusercontent.com/nadi-pro/shipper/master/nadi.reference.yaml
```

## Windows

### Automatic Installation

Run in PowerShell as Administrator:

```powershell
powershell -command "(New-Object Net.WebClient).DownloadFile('https://raw.githubusercontent.com/nadi-pro/shipper/master/install.ps1', '%TEMP%\install.ps1') && %TEMP%\install.ps1 && del %TEMP%\install.ps1"
```

### Manual Installation

1. Download from [releases](https://github.com/nadi-pro/shipper/releases/latest):
   - `shipper-windows-amd64.zip`

2. Create directories:
   ```
   C:\Program Files\Nadi-Pro\Shipper\
   C:\ProgramData\Nadi-Pro\Shipper\
   ```

3. Extract `shipper.exe` to `C:\Program Files\Nadi-Pro\Shipper\`

4. Copy `nadi.reference.yaml` to `C:\ProgramData\Nadi-Pro\Shipper\nadi.yaml`

### Add to PATH

Add `C:\Program Files\Nadi-Pro\Shipper\` to your system PATH.

## Docker

### Docker Hub

```bash
docker pull nadipro/shipper:latest
```

### Run with Docker

```bash
docker run -d \
  --name shipper \
  -v /var/log/nadi:/var/log/nadi:ro \
  -v $(pwd)/nadi.yaml:/etc/nadi/nadi.yaml:ro \
  nadipro/shipper:latest
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  shipper:
    image: nadipro/shipper:latest
    restart: unless-stopped
    volumes:
      - /var/log/nadi:/var/log/nadi:ro
      - ./nadi.yaml:/etc/nadi/nadi.yaml:ro
```

## Verify Installation

### Check Version

```bash
shipper --version
```

### Check Configuration

```bash
shipper --config /path/to/nadi.yaml --validate
```

### Test Run

```bash
shipper --config /path/to/nadi.yaml --test
```

## Post-Installation

### 1. Configure Credentials

Edit the configuration file:

```yaml
nadi:
  apiKey: your-api-key
  token: your-application-key
  storage: /var/log/nadi
```

### 2. Set Permissions

Ensure Shipper can read the log directory:

```bash
# Linux/macOS
sudo chown -R shipper:shipper /opt/nadi-pro/shipper
sudo chmod 755 /var/log/nadi
```

### 3. Create Log Directory

If it doesn't exist:

```bash
sudo mkdir -p /var/log/nadi
sudo chown www-data:www-data /var/log/nadi  # Or your web server user
```

### 4. Test Connection

```bash
shipper --config /path/to/nadi.yaml --test
```

Expected output:
```
Connection test successful
API Key: Valid
App Key: Valid
Storage Path: /var/log/nadi (accessible)
```

## Upgrading

### Linux & macOS

```bash
sudo bash < <(curl -sL https://raw.githubusercontent.com/nadi-pro/shipper/master/install)
```

Your configuration will be preserved.

### Windows

1. Download the latest release
2. Stop the Shipper service
3. Replace the binary
4. Start the Shipper service

### Docker

```bash
docker pull nadipro/shipper:latest
docker-compose up -d
```

## Uninstallation

### Linux

```bash
sudo systemctl stop shipper
sudo systemctl disable shipper
sudo rm /etc/systemd/system/shipper.service
sudo rm /usr/local/bin/shipper
sudo rm -rf /opt/nadi-pro/shipper
```

### macOS

```bash
launchctl unload ~/Library/LaunchAgents/pro.nadi.shipper.plist
rm ~/Library/LaunchAgents/pro.nadi.shipper.plist
sudo rm /usr/local/bin/shipper
sudo rm -rf /usr/local/nadi-pro/shipper
```

### Windows

1. Stop and remove the service:
   ```powershell
   sc.exe stop Shipper
   sc.exe delete Shipper
   ```
2. Delete the installation directories

## Next Steps

- [Configuration](/shipper/configuration) - Configure Shipper
- [Deployment](/shipper/deployment) - Run in production
- [Troubleshooting](/shipper/troubleshooting) - Common issues
