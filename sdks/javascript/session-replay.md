# Session Replay <VersionBadge type="coming-soon">Coming Soon</VersionBadge>

::: warning Coming Soon
Session Replay is currently under development. The documentation below describes the planned features and API.
:::

Replay user sessions to understand how errors occurred and improve user experience.

## Overview

Session Replay records user interactions and allows you to replay them in the Nadi dashboard. This helps you:

- Understand exactly what users did before an error
- Reproduce bugs without asking for reproduction steps
- Identify UX issues and friction points
- Debug complex user flows

## Configuration

### Enable Session Replay

```javascript
import { init } from '@nadi-pro/browser'

init({
  appKey: 'your-app-key',
  enableSessionReplay: true,
})
```

### Full Configuration

```javascript
init({
  appKey: 'your-app-key',
  enableSessionReplay: true,
  sessionReplayOptions: {
    // Privacy - mask all input values
    maskAllInputs: true,

    // Privacy - mask all text content
    maskAllText: false,

    // CSS class to block recording
    blockClass: 'nadi-block',

    // CSS class to ignore in recording
    ignoreClass: 'nadi-ignore',

    // Input types to always mask
    maskInputTypes: ['password', 'email', 'tel', 'ssn'],

    // Sampling rate (0-1)
    sampleRate: 0.1,

    // Only record sessions with errors
    recordOnErrorOnly: false,

    // Maximum session duration (ms)
    maxSessionDuration: 3600000, // 1 hour
  },
})
```

## Privacy Controls

### Masking Inputs

```javascript
{
  sessionReplayOptions: {
    // Mask all input values (shows ****)
    maskAllInputs: true,

    // Or mask specific input types
    maskAllInputs: false,
    maskInputTypes: ['password', 'email', 'tel', 'credit-card'],
  }
}
```

### Masking Text

```javascript
{
  sessionReplayOptions: {
    // Mask all text (shows placeholder text)
    maskAllText: true,
  }
}
```

### Blocking Elements

Block specific elements from being recorded:

```html
<!-- This element won't appear in replay -->
<div class="nadi-block">
  Sensitive content here
</div>
```

```javascript
{
  sessionReplayOptions: {
    blockClass: 'nadi-block',
    // Or use multiple classes
    blockClass: ['nadi-block', 'private'],
  }
}
```

### Ignoring Elements

Ignore interactions with specific elements:

```html
<!-- Clicks on this won't be recorded -->
<button class="nadi-ignore">Secret Action</button>
```

### Blocking Selectors

Block by CSS selector:

```javascript
{
  sessionReplayOptions: {
    blockSelector: '[data-private], .credit-card-form',
  }
}
```

## Sampling

### Sample Rate

Control what percentage of sessions are recorded:

```javascript
{
  sessionReplayOptions: {
    sampleRate: 0.1, // 10% of sessions
  }
}
```

### Error-Only Recording

Only record sessions where an error occurs:

```javascript
{
  sessionReplayOptions: {
    recordOnErrorOnly: true,
  }
}
```

This starts buffering immediately but only saves if an error occurs.

### Conditional Recording

Start/stop recording programmatically:

```javascript
import { startSessionReplay, stopSessionReplay } from '@nadi-pro/browser'

// Start recording for specific user flow
function startCheckout() {
  startSessionReplay()
  // ... checkout logic
}

// Stop recording
function exitCheckout() {
  stopSessionReplay()
}
```

## What's Recorded

### Captured

- Mouse movements and clicks
- Keyboard input (masked by default)
- Scroll events
- Page navigation
- DOM changes
- Network requests (metadata only)
- Console output

### Not Captured

- Input values (when masked)
- Blocked elements
- Network request/response bodies
- Local storage/cookies
- WebSocket data

## Viewing Replays

### In the Dashboard

1. Navigate to an error in Nadi
2. Click "View Session Replay"
3. Use playback controls:
   - Play/Pause
   - Speed control (1x, 2x, 4x)
   - Skip to error
   - Timeline scrubbing

### Features

- **Timeline** - See events over time
- **Skip inactivity** - Jump over idle periods
- **DOM inspector** - Inspect elements at any point
- **Console tab** - See console output
- **Network tab** - See API calls

## Session Metadata

Add context to sessions:

```javascript
import { setSessionData } from '@nadi-pro/browser'

setSessionData({
  user_flow: 'checkout',
  cart_value: 99.99,
  experiment: 'new-checkout-v2',
})
```

## Session Links

Link to specific sessions:

```javascript
import { getSessionUrl } from '@nadi-pro/browser'

// Get URL to current session
const replayUrl = getSessionUrl()
console.log('Replay URL:', replayUrl)

// Include in support tickets
supportTicket.replayUrl = getSessionUrl()
```

## Performance Impact

Session Replay is designed for minimal impact:

- ~50KB additional JavaScript
- ~1-2% CPU overhead during recording
- Events are batched and compressed
- Minimal network usage

### Optimizing Performance

```javascript
{
  sessionReplayOptions: {
    // Reduce mutation observer overhead
    slimDOMOptions: {
      script: true,
      comment: true,
      headFavicon: true,
      headWhitespace: true,
    },

    // Reduce sampling for mouse moves
    mousemoveWait: 100, // ms

    // Compress payloads
    compress: true,
  }
}
```

## Debugging

### Check Recording Status

```javascript
import { isRecording, getSessionId } from '@nadi-pro/browser'

console.log('Recording:', isRecording())
console.log('Session ID:', getSessionId())
```

### Debug Mode

```javascript
init({
  appKey: 'your-app-key',
  enableSessionReplay: true,
  debug: true, // Logs replay events
})
```

## Best Practices

### Do

- Always mask sensitive inputs
- Block elements with PII
- Use sampling in production
- Test replay quality in staging

### Don't

- Record without user consent (where required)
- Include full network bodies
- Set sample rate too high (costs + performance)
- Forget about GDPR/privacy compliance

## Privacy Compliance

### GDPR Considerations

- Inform users about recording in your privacy policy
- Consider requiring consent before recording
- Ensure PII is properly masked
- Allow users to opt out

### Consent Banner Example

```javascript
// Only start recording after consent
if (userHasConsented()) {
  init({
    appKey: 'your-app-key',
    enableSessionReplay: true,
  })
}
```

## Troubleshooting

### Replay Not Playing

1. Check session was recorded (sampling)
2. Verify no blockers on the page
3. Check for JavaScript errors in replay

### Missing Content

1. Add fonts and images to CDN
2. Check blocked elements
3. Verify CSS is accessible

### Performance Issues

1. Reduce sample rate
2. Use error-only recording
3. Block heavy animations

## Next Steps

- [Source Maps](/sdks/javascript/source-maps) - Debug minified code
- [Error Tracking](/sdks/javascript/error-tracking) - Capture errors
- [Web Vitals](/sdks/javascript/web-vitals) - Performance monitoring
