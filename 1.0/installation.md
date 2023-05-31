# Installation

[[toc]]

## Requirements

Nadi has a few requirements you should be aware of before installing:

- Composer
- Laravel Framework 7+

## Installing Nadi

```bash
composer require cleaniquecoders/nadi-laravel
php artisan nadi:install
```

After running this command, verify that the `nadi.php` was added to the `config/` directory.

Add the following keys in your `.env`

```bash
NADI_ENDPOINT="https://nadi.cleaniquecoders.com/api"
NADI_DRIVER=http
NADI_KEY=api-key
NADI_TOKEN=application-token
```

Test connectivity with Nadi API:

```bash
php artisan nadi:test
```

Then create your application [here](https://nadi.pro/applications/create) and copy the application's key and paste in the `NADI_TOKEN` in your `.env` file..

Then create your API Token [here](https://nadi.pro/user/api-tokens) and copy the token and paste in the `NADI_KEY` in your `.env` file.

Once updated your `.env`, you need to run the following command to verify the connection to Nadi API is configured correctly:

```bash
php artisan nadi:verify
```

## Bug Reports

If you discover a bug in Nadi, please open an issue on the [Nadi issues GitHub repository](https://github.com/cleaniquecoders/nadi-issues).
