# Migration Guide

## v3 → v4 (Plausible script v2)

Plausible [released a new script](https://plausible.io/docs/script-update-guide) that consolidates all features into a single file configured at runtime. This removes the need for filename-based modifiers (e.g. `script.outbound-links.hash.js`) and simplifies the `next-plausible` API significantly.

### `PlausibleProvider`

#### `domain` → `src`

The `domain` prop is replaced by `src`, which takes the full site-specific script URL from your Plausible dashboard.

```diff
- <PlausibleProvider domain="example.com">
+ <PlausibleProvider src="https://plausible.io/js/pa-XXXXX.js">
```

Find your script URL at `https://plausible.io/{yoursite}/installation?flow=review` in the Plausible dashboard.

#### `customDomain` removed

Previously used to point at a custom domain serving the Plausible script. Now just pass your custom domain's script URL directly to `src`:

```diff
- <PlausibleProvider domain="example.com" customDomain="https://stats.example.com">
+ <PlausibleProvider src="https://stats.example.com/js/pa-XXXXX.js">
```

#### `selfHosted` removed

Self-hosted instances also use the new script. Pass your instance's script URL to `src`:

```diff
- <PlausibleProvider domain="example.com" customDomain="https://plausible.example.com" selfHosted>
+ <PlausibleProvider src="https://plausible.example.com/js/pa-XXXXX.js">
```

#### Feature flags → `init` object

All boolean feature props are replaced by an `init` object passed to `plausible.init()`.

| Old prop             | New `init` option                          |
| -------------------- | ------------------------------------------ |
| `trackLocalhost`     | `captureOnLocalhost: true`                 |
| `manualPageviews`    | `autoCapturePageviews: false`              |
| `hash`               | `hashBasedRouting: true`                   |
| `trackFileDownloads` | `fileDownloads: { fileExtensions: [...] }` |
| `pageviewProps`      | `customProperties` (see below)             |

```diff
  <PlausibleProvider
-   domain="example.com"
-   trackLocalhost
-   manualPageviews
-   hash
-   trackFileDownloads
+   src="https://plausible.io/js/pa-XXXXX.js"
+   init={{
+     captureOnLocalhost: true,
+     autoCapturePageviews: false,
+     hashBasedRouting: true,
+     fileDownloads: { fileExtensions: ['pdf', 'zip'] },
+   }}
  >
```

#### `pageviewProps` → `init.customProperties`

Pageview props can be a static object or a function:

```diff
- <PlausibleProvider domain="example.com" pageviewProps={{ author: 'Alice' }}>
+ <PlausibleProvider src="..." init={{ customProperties: { author: 'Alice' } }}>
```

When using a function, it receives the event name and must be **self-contained** (no references to variables outside it, as it is serialized into an inline script):

```jsx
<PlausibleProvider
  src="..."
  init={{
    customProperties: (eventName) => ({
      author: 'Alice',
    }),
  }}
/>
```

#### `trackOutboundLinks`, `taggedEvents`, `revenue` removed

These features are now bundled directly into the Plausible v2 script — no opt-in required. Remove these props and they will work automatically once you switch to a v2 script URL.

```diff
  <PlausibleProvider
-   domain="example.com"
-   trackOutboundLinks
-   taggedEvents
-   revenue
+   src="https://plausible.io/js/pa-XXXXX.js"
  >
```

#### `exclude` removed

Page exclusion is now configured in your Plausible dashboard rather than via a script prop. See [Plausible's exclusion docs](https://plausible.io/docs/excluding-pages).

---

### `withPlausibleProxy`

#### `src` is now required

The proxy needs to know where to forward requests. Pass the same script URL you use in `PlausibleProvider`:

```diff
- module.exports = withPlausibleProxy()({
+ module.exports = withPlausibleProxy({
+   src: 'https://plausible.io/js/pa-XXXXX.js',
+ })({
    // ...next config
  })
```

#### `subdirectory` and `scriptName` removed → `scriptPath` and `apiPath`

The old options for customising local proxy paths are replaced by `scriptPath` and `apiPath`, which set the full local paths directly. Defaults are `/js/script.js` and `/api/event`.

```diff
  module.exports = withPlausibleProxy({
+   src: 'https://plausible.io/js/pa-XXXXX.js',
-   subdirectory: 'proxy',
-   scriptName: 'myscript',
+   scriptPath: '/proxy/myscript.js',
+   apiPath: '/proxy/api/event',
  })({ /* ... */ })
```

When using a `basePath` in your Next.js config, `withPlausibleProxy` prepends it automatically — you do not need to include it in `scriptPath` or `apiPath`.

#### `customDomain` removed

Pass your custom domain's script URL as `src` instead:

```diff
  module.exports = withPlausibleProxy({
-   customDomain: 'https://stats.example.com',
+   src: 'https://stats.example.com/js/pa-XXXXX.js',
  })({ /* ... */ })
```

#### `PlausibleProvider` requires no props when using the proxy

When the proxy is active, `src` is injected automatically:

```jsx
<PlausibleProvider>...</PlausibleProvider>
```

---

### Complete before/after example

**Before (v3):**

```js
// next.config.js
const { withPlausibleProxy } = require('next-plausible')

module.exports = withPlausibleProxy()({})
```

```jsx
// pages/_app.js
import PlausibleProvider from 'next-plausible'

export default function MyApp({ Component, pageProps }) {
  return (
    <PlausibleProvider
      domain="example.com"
      trackOutboundLinks
      trackLocalhost
      hash
    >
      <Component {...pageProps} />
    </PlausibleProvider>
  )
}
```

**After (v4):**

```js
// next.config.js
const { withPlausibleProxy } = require('next-plausible')

module.exports = withPlausibleProxy({
  src: 'https://plausible.io/js/pa-XXXXX.js',
})({})
```

```jsx
// pages/_app.js
import PlausibleProvider from 'next-plausible'

export default function MyApp({ Component, pageProps }) {
  return (
    <PlausibleProvider
      init={{
        captureOnLocalhost: true,
        hashBasedRouting: true,
      }}
    >
      <Component {...pageProps} />
    </PlausibleProvider>
  )
}
```
