# Next-Plausible &middot; [![npm version](https://img.shields.io/npm/v/next-plausible.svg?style=flat)](https://www.npmjs.com/package/next-plausible)

Simple integration for https://plausible.io analytics and https://nextjs.org.

See [this commit](https://github.com/4lejandrito/react-guitar/commit/a634d43cab5c4da5da5aeabaa792a5f42c21a1ed) for a real world example.

## Usage

In a NextJS page:

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

To send custom events:

```jsx
import {usePlausible} from 'next-plausible'

export default PlausibleButton() {
    const plausible = usePlausible()

    return (
        <>
            <button onClick={() => plausible('customEventName')}>
                Send
            </button>

            <button
                id="foo"
                onClick={() => plausible('customEventName', {
                    props: {
                        buttonId: 'foo'
                    }})
                }
            >
                Send with props
            </button>
        </>
    )
}
```

## Developing

- `yarn build` will generate the production scripts under the `dist` folder.
