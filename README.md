# Next-Plausible &middot; [![npm version](https://img.shields.io/npm/v/next-plausible.svg?style=flat)](https://www.npmjs.com/package/next-plausible)

Simple integration for https://nextjs.org and https://plausible.io analytics.

See it in action at https://next-plausible.vercel.app, and [this commit](https://github.com/4lejandrito/react-guitar/commit/a634d43cab5c4da5da5aeabaa792a5f42c21a1ed) for a real world example.

**Important:** If you're using a version of next lower than `11.1.0` please use `next-plausible@2` to avoid type checking errors (see https://github.com/4lejandrito/next-plausible/issues/25).

## Usage

### Include the Analytics Script

To enable Plausible analytics in your Next.js app you'll need to expose the Plausible context, `<PlausibleProvider />`, at the top level of your application inside [`_app.js`](https://nextjs.org/docs/advanced-features/custom-app):

```jsx
// pages/_app.js
import PlausibleProvider from 'next-plausible'

export default function MyApp({ Component, pageProps }) {
  return (
    <PlausibleProvider domain="example.com">
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
    <PlausibleProvider domain="example.com">
      <h1>My Site</h1>
      {/* ... */}
    </PlausibleProvider>
  )
}
```

If are using [the app directory](https://beta.nextjs.org/docs/routing/fundamentals#the-app-directory) include `PlausibleProvider` inside the root layout:

```jsx
// app/layout.js
import PlausibleProvider from 'next-plausible'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <PlausibleProvider domain="example.com" />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

#### `PlausibleProvider` Props

| Name                 | Description                                                                                                                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`             | The domain of the site you want to monitor.                                                                                                                                         |
| `customDomain`       | Set this if you use a custom domain to serve the analytics script. Defaults to https://plausible.io. See https://plausible.io/docs/custom-domain for more details.                  |
| `trackOutboundLinks` | Set this to `true` if you want to enable [outbound link click tracking](https://plausible.io/docs/outbound-link-click-tracking#see-all-the-outbound-link-clicks-in-your-dashboard). |
| `trackFileDownloads` | Set this to `true` if you want to enable [file download tracking](https://plausible.io/docs/file-downloads-tracking).                                                               |
| `taggedEvents`       | Set this to `true` if you want to enable [custom event tracking in HTML elements](https://plausible.io/docs/custom-event-goals).                                                    |
| `trackLocalhost`     | Set this to `true` if you want to enable localhost tracking as described [here](https://plausible.io/docs/script-extensions).                                                       |
| `manualPageviews`    | Set this to `true` if you want to disable automatic pageview events as described [here](https://plausible.io/docs/script-extensions#plausiblemanualjs).                             |
| `exclude`            | Set this if you want to exclude a set of pages from being tracked. See https://plausible.io/docs/excluding-pages for more details.                                                  |
| `selfHosted`         | Set this to `true` if you are self hosting your Plausible instance. Otherwise you will get a 404 when requesting the script.                                                        |
| `enabled`            | Use this to explicitly decide whether or not to render script. If not passed the script will be rendered in production environments.                                                |
| `integrity`          | Optionally define the [subresource integrity](https://infosec.mozilla.org/guidelines/web_security#subresource-integrity) attribute for extra security.                              |
| `scriptProps`        | Optionally override any of the props passed to the script element. See [example](test/page/pages/scriptProps.js).                                                                   |

### Proxy the Analytics Script

To avoid being blocked by adblockers plausible [recommends proxying the script](https://plausible.io/docs/proxy/introduction). To do this you need to wrap your `next.config.js` with the `withPlausibleProxy` function:

```js
const { withPlausibleProxy } = require('next-plausible')

module.exports = withPlausibleProxy()({
  // ...your next js config, if any
  // Important! it is mandatory to pass a config object, even if empty
})
```

This will set up the necessary rewrites as described [here](https://plausible.io/docs/proxy/guides/nextjs#using-raw-nextjs-config) and configure `PlausibleProvider` to use the local URLs so you can keep using it like this:

```jsx
  <PlausibleProvider domain="example.com">
    ...
  </PlausibleProvider>
}
```

Optionally you can overwrite the proxied script subdirectory and name, as well as the custom domain for the original script:

```js
const { withPlausibleProxy } = require('next-plausible')

module.exports = withPlausibleProxy({
  subdirectory: 'yoursubdirectory',
  scriptName: 'scriptName',
  customDomain: 'http://example.com',
})({
  // ...your next js config, if any
  // Important! it is mandatory to pass a config object, even if empty
})
```

This will load the script from `/yoursubdirectory/js/scriptName.js` and fetch it from `http://example.com/js/script.js`.

**Notes:**

- Proxying will only work if you serve your site using `next start`. Statically generated sites won't be able to rewrite the requests.
- If you are self hosting plausible, you need to set `customDomain` to your instance otherwise no data will be sent.
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
