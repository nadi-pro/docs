# Configuration

In order to connect to the Nadi, you will need two type of keys:

1. API Key - each user can create multiple API key that will be use as identifier who's own the transaction requested.
2. Application Key - each application that you need to monitor, you need an Application Key. This is required in order to identify logs sent from you applications can be identify from Nadi ends.

## Creating API Key and Application Key

First, you will need to create an API Token. Click [here](https://nadi.cleaniquecoders.com/user/api-tokens), and create a new API Token. Copy the token and paste in the `NADI_API_KEY` in your `.env` file.

Then you need to create Application Token. Click [here](https://nadi.cleaniquecoders.com/applications/create) and create a new application record. You can copy the application's key and paste in the `NADI_APP_KEY` in your `.env` file.

Add the following keys in your `.env`

```bash
NADI_ENDPOINT="https://nadi.cleaniquecoders.com/api"
NADI_DRIVER=http
NADI_API_KEY=api-key
NADI_APP_KEY=application-key
```
