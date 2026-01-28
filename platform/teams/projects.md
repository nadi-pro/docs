# Projects

Manage your applications and their settings.

## Overview

A project represents a single application in Nadi. Each project has:

- Unique application key
- Environment configuration
- Alert rules
- Team access settings

## Creating Projects

### New Project

1. Go to **Settings** → **Projects**
2. Click **New Project**
3. Enter project name
4. Select platform (Laravel, PHP, JavaScript, etc.)
5. Click **Create**

### Project Details

After creation:

1. Copy your **Application Key**
2. Note the **API endpoint**
3. Configure your SDK

## Project Settings

### General

| Setting | Description |
|---------|-------------|
| **Name** | Display name in dashboard |
| **Platform** | Technology stack |
| **Default Environment** | Environment for filtering |

### Environments

Define environments:

```
production  - Live application
staging     - Pre-release testing
development - Local development
```

Add custom environments:
1. Go to project settings
2. Click **Environments**
3. Add environment name

### Data Retention

Configure how long data is stored:

| Tier | Retention |
|------|-----------|
| Free | 7 days |
| Pro | 30 days |
| Team | 90 days |
| Enterprise | Custom |

### Rate Limits

View and configure rate limits:

- Events per minute
- Events per day
- Burst allowance

## Project Keys

### Application Key

Used by SDKs to identify the project:

```
NADI_APP_KEY=nadi_app_xxxxxxxxxxxxx
```

### Regenerating Keys

If a key is compromised:

1. Go to project settings
2. Click **Regenerate App Key**
3. Update all SDK configurations
4. Old key is immediately invalidated

::: danger
Regenerating invalidates the old key immediately. Update all deployments before regenerating.
:::

## Multiple Projects

### When to Use Multiple Projects

| Scenario | Recommendation |
|----------|----------------|
| Same app, different environments | One project |
| Different apps, same repo | Separate projects |
| Microservices | Separate projects |
| Frontend + Backend | Separate projects |

### Project Organization

Naming conventions:
- `my-app-frontend`
- `my-app-backend`
- `my-app-worker`

Or by team:
- `team-a-service`
- `team-b-service`

## Project Access

### Team Access

By default, all team members can access all projects.

### Restricted Access

Limit who can access:

1. Go to project settings
2. Click **Access Control**
3. Select specific members
4. Set their permission level

## Project Transfer

### Between Organizations

To transfer a project:

1. Go to project settings
2. Click **Transfer Project**
3. Enter destination organization
4. Confirm transfer

Requirements:
- You must be owner of both orgs
- Or have admin in destination

## Archiving Projects

### Archive

For inactive projects:

1. Go to project settings
2. Click **Archive**
3. Confirm

Archived projects:
- Stop accepting events
- Data is retained
- Can be restored

### Restore

1. Go to **Settings** → **Archived Projects**
2. Click **Restore**

### Delete

Permanently delete:

1. Archive the project first
2. Go to archived projects
3. Click **Delete Permanently**
4. Confirm deletion

::: danger
Deletion is permanent. All data will be lost.
:::

## Project Statistics

View project metrics:

- Total events (lifetime)
- Events this month
- Storage used
- Active users

## Next Steps

- [API Keys](/platform/teams/api-keys) - Manage credentials
- [Team Management](/platform/teams/) - Manage team members
