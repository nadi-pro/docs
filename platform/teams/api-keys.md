# API Keys

Manage authentication credentials for Nadi.

## Key Types

### API Key

Authenticates API requests (used by Shipper):

```
NADI_API_KEY=nadi_api_xxxxxxxxxxxxx
```

**Scope:** Account-level
**Use:** Shipper agent, API access

### Application Key

Identifies a specific project:

```
NADI_APP_KEY=nadi_app_xxxxxxxxxxxxx
```

**Scope:** Project-level
**Use:** SDKs, error tagging

## Managing API Keys

### View Your API Key

1. Click your profile icon
2. Go to **Settings** → **API Tokens**
3. View or copy your API key

### Regenerate API Key

If compromised:

1. Go to **Settings** → **API Tokens**
2. Click **Regenerate**
3. Update all Shipper configurations
4. Old key is immediately invalidated

::: danger Immediate Invalidation
Regenerating immediately invalidates the old key. Update all deployments first to avoid service interruption.
:::

## Managing Application Keys

### View App Key

1. Go to **Settings** → **Projects**
2. Select the project
3. View the application key

### Regenerate App Key

1. Go to project settings
2. Click **Regenerate App Key**
3. Update SDK configurations
4. Redeploy applications

## Key Security

### Best Practices

#### Do

- Store keys in environment variables
- Use secrets management (Vault, AWS Secrets Manager)
- Rotate keys periodically
- Use different keys per environment

#### Don't

- Commit keys to version control
- Share keys via chat/email
- Use production keys in development
- Expose API keys in client-side code

### Environment Variables

```bash
# .env (never commit)
NADI_API_KEY=nadi_api_xxxxxxxxxxxxx
NADI_APP_KEY=nadi_app_xxxxxxxxxxxxx
```

### Secrets Management

#### AWS Secrets Manager

```bash
aws secretsmanager create-secret \
  --name nadi/api-key \
  --secret-string "nadi_api_xxxxxxxxxxxxx"
```

#### HashiCorp Vault

```bash
vault kv put secret/nadi api_key="nadi_api_xxxxxxxxxxxxx"
```

#### Kubernetes Secrets

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: nadi-credentials
type: Opaque
stringData:
  api-key: nadi_api_xxxxxxxxxxxxx
  app-key: nadi_app_xxxxxxxxxxxxx
```

## Key Rotation

### Rotation Schedule

| Environment | Recommendation |
|-------------|----------------|
| Development | On demand |
| Staging | Monthly |
| Production | Quarterly |

### Rotation Process

1. **Prepare** - Ensure you can quickly update all configs
2. **Regenerate** - Create new key
3. **Update** - Deploy new key to all services
4. **Verify** - Confirm services are working
5. **Monitor** - Watch for authentication errors

### Zero-Downtime Rotation

For API keys with Shipper:

1. Update Shipper configs with new key
2. Restart Shipper instances
3. Verify events are flowing
4. Then regenerate (invalidate old key)

## Audit Log

Track key usage:

1. Go to **Settings** → **Activity Log**
2. Filter by "API Key" actions
3. View creation, regeneration, usage

## Multiple Keys

### Per-Service Keys

For microservices, use separate app keys:

| Service | App Key |
|---------|---------|
| Frontend | `nadi_app_frontend_xxx` |
| Backend | `nadi_app_backend_xxx` |
| Worker | `nadi_app_worker_xxx` |

### Benefits

- Isolate services
- Track per-service errors
- Revoke without affecting others

## Troubleshooting

### "Invalid API Key"

1. Verify key is correct (no extra spaces)
2. Check key hasn't been regenerated
3. Confirm using API key (not app key)

### "Application Not Found"

1. Verify app key is correct
2. Confirm project exists
3. Check using app key (not API key)

### "Rate Limited"

1. Check rate limits in dashboard
2. Implement sampling if needed
3. Contact support for limit increase

## API Reference

### Authentication Header

```bash
curl -H "Authorization: Bearer NADI_API_KEY" \
  https://nadi.pro/api/projects
```

### Verify Key

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://nadi.pro/api/auth/verify
```

Response:
```json
{
  "valid": true,
  "organization": "your-org",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Next Steps

- [Projects](/platform/teams/projects) - Manage projects
- [Team Management](/platform/teams/) - Manage team members
