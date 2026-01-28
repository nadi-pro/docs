# Team Management

Collaborate with your team on error monitoring.

## Overview

Team features allow you to:

- Invite team members
- Assign roles and permissions
- Manage multiple projects
- Track issue ownership

## Team Structure

```
Organization
├── Team Members
│   ├── Owners
│   ├── Admins
│   └── Members
└── Projects
    ├── Production App
    ├── Staging App
    └── Mobile App
```

## Inviting Members

### Send Invitation

1. Go to **Settings** → **Team**
2. Click **Invite Member**
3. Enter email address
4. Select role
5. Click **Send Invite**

### Invitation Link

Generate a join link:

1. Click **Get Invite Link**
2. Set expiration (24h, 7d, 30d)
3. Share the link

## Roles

### Owner

Full control:
- Manage billing
- Delete organization
- All admin permissions

### Admin

Management access:
- Invite/remove members
- Manage projects
- Configure integrations
- View all data

### Member

Standard access:
- View issues
- Resolve/ignore issues
- View alerts
- Limited settings

### Viewer

Read-only access:
- View issues
- View trends
- No actions allowed

## Permissions Matrix

| Permission | Owner | Admin | Member | Viewer |
|------------|-------|-------|--------|--------|
| View issues | ✓ | ✓ | ✓ | ✓ |
| Resolve issues | ✓ | ✓ | ✓ | ✗ |
| Configure projects | ✓ | ✓ | ✗ | ✗ |
| Manage team | ✓ | ✓ | ✗ | ✗ |
| Manage billing | ✓ | ✗ | ✗ | ✗ |
| Delete org | ✓ | ✗ | ✗ | ✗ |

## Project Access

### Project-Level Permissions

Restrict access to specific projects:

1. Go to project settings
2. Click **Access Control**
3. Add members with specific access
4. Set permission level

### Team-Wide Access

By default, team members can access all projects. To restrict:

1. Go to **Settings** → **Access**
2. Disable **Team-Wide Access**
3. Configure per-project permissions

## Issue Assignment

### Assign Issues

1. Open an issue
2. Click **Assign**
3. Select team member
4. They receive notification

### Auto-Assignment

Configure automatic assignment:

1. Go to **Settings** → **Routing**
2. Create assignment rule
3. Set conditions (tag, file path)
4. Select assignee or team

Example rules:
- Frontend errors → Frontend Team
- API errors → Backend Team
- Payment errors → Payments Team

## Notifications

### Personal Preferences

Each member configures their notifications:

1. Click profile → **Notifications**
2. Set preferences per event type
3. Choose channels (email, Slack DM)

### Team Notifications

Configure team-wide notifications:

1. Go to **Settings** → **Notifications**
2. Set default preferences
3. Members can override

## Activity Log

Track team activity:

| Time | User | Action |
|------|------|--------|
| 10:30 | john@example.com | Resolved issue #123 |
| 10:25 | jane@example.com | Invited new member |
| 10:20 | john@example.com | Created alert rule |

View in **Settings** → **Activity Log**

## Removing Members

### Remove a Member

1. Go to **Settings** → **Team**
2. Find the member
3. Click **Remove**
4. Confirm removal

### Transfer Ownership

Before removing an owner:

1. Go to **Settings** → **Team**
2. Click **Transfer Ownership**
3. Select new owner
4. Confirm transfer

## Best Practices

### Role Assignment

- Limit Owners to 1-2 people
- Use Admin for leads/managers
- Use Member for developers
- Use Viewer for stakeholders

### Project Organization

- Separate production/staging projects
- Use meaningful project names
- Document project ownership

### Access Control

- Review permissions quarterly
- Remove inactive members
- Use project-level access for contractors

## SSO Integration

For enterprise plans, configure Single Sign-On:

1. Go to **Settings** → **Security**
2. Click **Configure SSO**
3. Select provider (Okta, Azure AD, etc.)
4. Follow setup wizard

## Next Steps

- [Projects](/platform/teams/projects) - Manage projects
- [API Keys](/platform/teams/api-keys) - Manage credentials
