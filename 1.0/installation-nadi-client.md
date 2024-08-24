# Nadi Client

[[toc]]

## Requirements

Nadi has a few requirements you should be aware of before installing.

1. Nadi Client
2. Nadi Shipper

## PHP

- Composer
- PHP 7 and above.
- [Laravel](#laravel)
- [WordPress](#wordpress)
- Symfony (coming soon)
- CakePHP (coming soon)
- CodeIgniter (coming soon)
- Yii (coming soon)

### Laravel

```bash
composer require nadi-pro/nadi-laravel
php artisan nadi:install
```

From version 1.1.0, we have added Sampling features. This allows you to control how the issues raised and push Nadi.

At the moment we have the following Sampling Strategies:

- Fix Rate Sampling: Captures a fixed percentage of events based on a predefined sampling rate, ensuring consistent sampling regardless of external factors.
- Interval Sampling: Samples events at regular intervals, capturing data at specific time-based checkpoints, which is ideal for time-based analysis or monitoring.
- Peak Load Sampling: Increases the sampling rate during periods of high system load or traffic, ensuring critical data is captured when the system is under stress, while reducing sampling during low load to conserve resources.
- Dynamic Rate Sampling: Adjusts the sampling rate dynamically based on system load or other factors, allowing for more granular control in high-traffic or resource-intensive scenarios.

> Do republish your Nadi config file if you are upgrading from version 1.0 to 1.1.

You may see the `config/nadi.php` for further configuration on sampling.

After running this command, continue to [Nadi Shipper](/1.0/installation-nadi-shipper.html) installation.

### WordPress

You can install the plugin by download it [here](https://github.com/nadi-pro/nadi-wordpress/releases/latest) and upload in the WordPress > Plugin section.

Then you can go to Nadi menu to set the API Key and Application Key.

To test the settings, simply click on **Test Connection** after save the settings.

> At the moment only HTTP Transporter is test and supported.
