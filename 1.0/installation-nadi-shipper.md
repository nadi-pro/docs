# Nadi Shipper

[[toc]]

## Requirements

Nadi Shipper can be install in the all Linux and Windows platform.

### Installation for Linux & Mac

Linux & Mac users can install it directly to `/usr/local/bin/shipper` with:

```bash
sudo bash < <(curl -sL https://raw.githubusercontent.com/nadi-pro/shipper/master/install)
```

### Installation for Windows

Run the following command as Administrator in Poweshell:

```batch
powershell -command "(New-Object Net.WebClient).DownloadFile('https://raw.githubusercontent.com/nadi-pro/shipper/master/install.ps1', '%TEMP%\install.ps1') && %TEMP%\install.ps1 && del %TEMP%\install.ps1"
```

**OR**

If you having issues to run the above command, download it manually from [release](https://github.com/nadi-pro/shipper/releases/) page.

Then two directories:

1. C:\Program Files\Nadi-Pro\Shipper - extract the zip file downloaded above in this directory.
2. C:\ProgramData\Nadi-Pro\Shipper - will be use to keep `nadi.yaml` here.

### Configuration

For Windows, copy the [nadi.reference.yaml](nadi.reference.yaml) to `nadi.yaml`, save it to
`C:\ProgramData\Nadi-Pro\Shipper`.

For Linux, the `nadi.yaml` already created in `/opt/nadi-pro/shipper` for all Linux. For MacOS, it's located in `/usr/local/nadi-pro/shipper`.

Then update the respective values:

```yaml
###################### Nadi Configuration ##################################

# This file is a configuration file for Nadi Shipper.
#
# You can find the full configuration reference here:
# https://docs.nadi.pro/nadi-shipper

# ============================== Nadi inputs ===============================

nadi:
  # Nadi API Endpoint
  endpoint: https://nadi.pro/api/

  # Accept Header
  accept: application/vnd.nadi.v1+json

  # Login to Nadi app and create your API Token from
  apiKey:

  # Create an application and copy the Application's token and paste it here.
  token:

  # Set path to Nadi logs. By default the path is /var/log/nadi.
  storage: /var/log/nadi

  # Set the Path for tracker.json
  trackerFile: tracker.json

  # Set this to true if you want to maintain the Nadi log after sending them. Default is false.
  persistent: false

  # Set maximum tries to send over the logs. Default is 3 times.
  maxTries: 3

  # Set maximum time before timeout. Default is 1 minute.
  timeout: 1m
```

#### Shipping Multiple Applications Log in One Server

In case of monitoring multiple applications in one server, you will need to create custom `nadi.yaml` for each of the application.

You may use Supervisord to run multiple workers to monitor your applications in a single server.

Sample supervisord setup:

```ini
[program:shipper-app1]
process_name=%(program_name)s
command=/usr/local/bin/shipper --config=/path/to/shipper/config/nadi-app1.yaml --record
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/nadi/nadi-app1.log
stopwaitsecs=3600

[program:shipper-app2]
process_name=%(program_name)s
command=/usr/local/bin/shipper --config=/path/to/shipper/config/nadi-app2.yaml --record
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/nadi/nadi-app2.log
stopwaitsecs=3600
```
