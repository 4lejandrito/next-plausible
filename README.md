# Next-Plausible &middot; [![npm version](https://img.shields.io/npm/v/next-plausible.svg?style=flat)](https://www.npmjs.com/package/next-plausible)

Simple integration for https://nextjs.org and https://plausible.io analytics.

See it in action at https://next-plausible.vercel.app, and [this commit](https://github.com/4lejandrito/react-guitar/commit/a634d43cab5c4da5da5aeabaa792a5f42c21a1ed) for a real world example.

**Important:** If you're using a version of next lower than `11.1.0` please use `next-plausible@2` to avoid type checking errors (see https://github.com/4lejandrito/next-plausible/issues/25).

**Upgrading from v3?** See the [migration guide](MIGRATION.md).

## Usage

### Include the Analytics Script

To enable Plausible analytics in your Next.js app you'll need to expose the Plausible context, `<PlausibleProvider />`, at the top level of your application inside [`_app.js`](https://nextjs.org/docs/advanced-features/custom-app).

First, find your site-specific script URL in your Plausible dashboard (it looks like `https://plausible.io/js/pa-XXXXX.js`).

```jsx
// pages/_app.js
import PlausibleProvider from 'next-plausible'

export default function MyApp({ Component, pageProps }) {
  return (
    <PlausibleProvider src="https://plausible.io/js/pa-XXXXX.js">
      <Component {...pageProps} />
    </PlausibleProvider>
  )
}
```

If you want to enable Plausible analytics only on a single page you can wrap the page in a `PlausibleProvider` component:

```jsx
// pages/home.js
import PlausibleProvider from 'next-plausible'

export default Home() {
  return (
    <PlausibleProvider src="https://plausible.io/js/pa-XXXXX.js">
      <h1>My Site</h1>
      {/* ... */}
    </PlausibleProvider>
  )
}
```

If you are using [the app directory](https://beta.nextjs.org/docs/routing/fundamentals#the-app-directory) use `PlausibleProvider` inside the root layout:

```jsx
// app/layout.js
import PlausibleProvider from 'next-plausible'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PlausibleProvider src="https://plausible.io/js/pa-XXXXX.js">
          {children}
        </PlausibleProvider>
      </body>
    </html>
  )
}
```

#### `PlausibleProvider` Props

| Name          | Description                                                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`         | The site-specific script URL from your Plausible dashboard, e.g. `https://plausible.io/js/pa-XXXXX.js`. Not required when using `withPlausibleProxy`.                   |
| `init`        | Options passed to `plausible.init()`. See below for available options.                                                                                                  |
| `enabled`     | Use this to explicitly decide whether or not to render script. If not passed the script will be rendered in production environments (checking NODE_ENV and VERCEL_ENV). |
| `integrity`   | Optionally define the [subresource integrity](https://infosec.mozilla.org/guidelines/web_security#subresource-integrity) attribute for extra security.                  |
| `scriptProps` | Optionally override any of the props passed to the script element. See [example](test/page/pages/scriptProps.js).                                                       |

#### `init` Options

These are passed directly to `plausible.init()`:

| Name                   | Description                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `customProperties`     | Set [custom properties](https://plausible.io/docs/custom-props/introduction) as an object or function. |
| `endpoint`             | Set a custom tracking endpoint. When using the proxy this is set automatically.                        |
| `fileDownloads`        | Track only certain file types as downloads, e.g. `{ fileExtensions: ['pdf'] }`.                        |
| `hashBasedRouting`     | Set to `true` to enable [hash-based routing](https://plausible.io/docs/hash-based-routing).            |
| `autoCapturePageviews` | Set to `false` to disable [automatic pageview events](https://plausible.io/docs/custom-locations).     |
| `captureOnLocalhost`   | Set to `true` to enable localhost tracking.                                                            |

### Proxy the Analytics Script

To avoid being blocked by adblockers plausible [recommends proxying the script](https://plausible.io/docs/proxy/introduction). To do this you need to wrap your `next.config.js` with the `withPlausibleProxy` function:

```js
const { withPlausibleProxy } = require('next-plausible')

module.exports = withPlausibleProxy({
  src: 'https://plausible.io/js/pa-XXXXX.js',
})({
  // ...your next js config, if any
  // Important! it is mandatory to pass a config object, even if empty
})
```

This will set up the necessary rewrites and configure `PlausibleProvider` to use the local proxy URLs automatically. When the proxy is active, `src` is not required:

```jsx
<PlausibleProvider>...</PlausibleProvider>
```

Optionally you can override the local paths for the proxied script and API endpoint:

```js
const { withPlausibleProxy } = require('next-plausible')

module.exports = withPlausibleProxy({
  src: 'https://plausible.io/js/pa-XXXXX.js',
  scriptPath: '/yourpath/script.js',
  apiPath: '/yourpath/api/event',
})({
  // ...your next js config, if any
  // Important! it is mandatory to pass a config object, even if empty
})
```

By default the script is served from `/js/script.js` and the API endpoint from `/api/event`, matching [Plausible's recommended proxy paths](https://plausible.io/docs/proxy/introduction).

**Notes:**

- Proxying will only work if you serve your site using `next start`. Statically generated sites won't be able to rewrite the requests.
- If you are self hosting plausible, use your instance URL as `src`.
- Bear in mind that tracking requests will be made to the same domain, so cookies will be forwarded. See https://github.com/4lejandrito/next-plausible/issues/67. If this is an issue for you, from `next@13.0.0` you can use [middleware](https://nextjs.org/docs/advanced-features/middleware#setting-headers) to strip the cookies like this:

  ```js
  import { NextResponse } from 'next/server'

  export function middleware(request) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('cookie', '')
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  export const config = {
    matcher: '/proxy/api/event',
  }
  ```

### Send Custom Events

Plausible supports custom events as described at https://plausible.io/docs/custom-event-goals. This package provides the `usePlausible` hook to safely access the `plausible` function like this:

```jsx
import { usePlausible } from 'next-plausible'

export default function PlausibleButton() {
  const plausible = usePlausible()

  return (
    <>
      <button onClick={() => plausible('customEventName')}>Send</button>

      <button
        id="foo"
        onClick={() =>
          plausible('customEventName', {
            props: {
              buttonId: 'foo',
            },
          })
        }
      >
        Send with props
      </button>
    </>
  )
}
```

If you use Typescript you can type check your custom events like this:

```tsx
import { usePlausible } from 'next-plausible'

type MyEvents = {
  event1: { prop1: string }
  event2: { prop2: string }
  event3: never
}

const plausible = usePlausible<MyEvents>()
```

Only those events with the right props will be allowed to be sent using the `plausible` function.

## Developing

- `npm run build` will generate the production scripts under the `dist` folder.
