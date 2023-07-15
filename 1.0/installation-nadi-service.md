# Run the Service

[[toc]]

## Run the Shipper for Linux

Enable Shipper service on startup.

```bash
sudo systemctl enable nadi.shipper.service
```

Run the Shipper service.

```bash
sudo systemctl start nadi.shipper.service
```

## Run the Shipper for Windows

Run command prompt as administrator, then:

```batch
cd C:\ProgramData\Nadi-Pro\Shipper
. ./shipper --config=C:\ProgramData\Nadi-Pro\Shipper\nadi.yaml
```

> For Windows, we are still in progress to make the service installation fix.

