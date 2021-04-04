# Next-Plausible &middot; [![npm version](https://img.shields.io/npm/v/next-plausible.svg?style=flat)](https://www.npmjs.com/package/next-plausible)

Simple integration for https://plausible.io analytics and https://nextjs.org.

See [this commit](https://github.com/4lejandrito/react-guitar/commit/a634d43cab5c4da5da5aeabaa792a5f42c21a1ed) for a real world example.

## Usage

### Include the analytics script

To include the Plausible analytics script in your NextJS page use the `PlausibleProvider` component:

```jsx
import PlausibleProvider from 'next-plausible'

export default Home() {
    return (
        <PlausibleProvider domain="example.com">
            <h1>My Site</h1>
            ...
        </PlausibleProvider>
    )
}
```

#### `PlausibleProvider` props:

| Name                 | Description                                                                                                                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `domain`             | The domain of the site you want to monitor.                                                                                                                                         |
| `customDomain`       | Set this if you use a custom domain to serve the analytics script. Defaults to https://plausible.io. See https://plausible.io/docs/custom-domain for more details.                  |
| `trackOutboundLinks` | Set this to `true` if you want to enable [outbound link click tracking](https://plausible.io/docs/outbound-link-click-tracking#see-all-the-outbound-link-clicks-in-your-dashboard). |
| `exclude`            | Set this if you want to exclude a set of pages from being tracked. See https://plausible.io/docs/excluding-pages for more details.                                                  |
| `selfHosted`         | Set this to `true` if you are self hosting your Plausible instance. Otherwise you will get a 404 when requesting the script.                                                        |
| `enabled`            | Use this to explicitly decide whether or not to render script. If not passed the script will be rendered when `process.env.NODE_ENV === 'production'`.                              |
| `integrity`          | Optionally define the [subresource integrity](https://infosec.mozilla.org/guidelines/web_security#subresource-integrity) attribute for extra security.                              |

### Send custom events:

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
              buttonId: 'foo'
            }
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

- `yarn build` will generate the production scripts under the `dist` folder.
