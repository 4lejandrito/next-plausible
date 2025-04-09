import { useEffect, useRef, useState } from 'react'
import { JSONTree } from 'react-json-tree'
import { Flipper, Flipped } from 'react-flip-toolkit'
import Popover from './Popover'
import { usePlausible } from '../next-plausible/index.esm'
import classNames from 'classnames'

export default function EventLog({ colors }) {
  const plausible = usePlausible()
  const ref = useRef()
  const [plausibleEvents, setPlausibleEvents] = useState([])
  const [busy, setBusy] = useState(false)
  const [pendingPlausibleEvents, setPendingPlausibleEvents] = useState([])
  const [help, setHelp] = useState(false)
  const [needsHelp, setNeedsHelp] = useState(true)
  useEffect(() => {
    window.addPlausibleEvent = (event) => {
      setPendingPlausibleEvents((plausibleEvents) => [
        event,
        ...plausibleEvents,
      ])
    }
  }, [])
  useEffect(() => {
    if (!busy) {
      const event = pendingPlausibleEvents.pop()
      if (event) {
        setBusy(true)
        setPlausibleEvents((plausibleEvents) => [event, ...plausibleEvents])
      }
    }
  }, [pendingPlausibleEvents, busy])
  useEffect(() => {
    ref.current.scrollTop = 0
  }, [plausibleEvents])
  return (
    <div
      className="flex-grow lg:flex-grow-0 flex flex-col gap-2 w-full lg:max-w-md bg-background-light p-4 rounded"
      onMouseEnter={() => needsHelp && setHelp(true)}
      onMouseLeave={() => setHelp(false)}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: `
            const originalFetch = window.fetch;
            window.fetch = function (...args) {
              const [url, options] = args;
              if (url.includes("/api/event")) {
                const body = options?.body;
                const event = JSON.parse(options?.body)
                if (event.n) {
                  window.addPlausibleEvent?.(event)
                }
              }
              return originalFetch.apply(this, args);
            };
          `,
        }}
      />
      <header className="flex pb-2">
        <span className="flex-grow text-copy-muted">
          Events sent by this page
        </span>
        <Popover content="Click me to send custom events!" open={help}>
          <button
            className={classNames(
              'inline-flex items-center justify-center h-6 relative text-sm font-medium bg-help rounded-full',
              plausibleEvents.length < 100 ? 'w-8' : 'w-10'
            )}
            onClick={() => {
              setNeedsHelp(false)
              setHelp(false)
              plausible('Custom Event', { props: { source: 'counter' } })
            }}
            onFocus={() => needsHelp && setHelp(true)}
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-help opacity-75" />
            <span className="relative">{plausibleEvents.length}</span>
          </button>
        </Popover>
      </header>
      <div ref={ref} className="h-80 overflow-auto scroll-smooth">
        <Flipper
          flipKey={plausibleEvents.length}
          className="flex flex-col gap-4"
        >
          {plausibleEvents.map((event, i) => (
            <Flipped
              key={plausibleEvents.length - i}
              flipId={plausibleEvents.length - i}
            >
              <div
                className="animate-appear"
                onAnimationEnd={() => setBusy(false)}
              >
                <JSONTree
                  data={event}
                  theme={{
                    base03: colors.copy.muted,
                    base07: colors.copy.muted,
                    base08: colors.json.nulls,
                    base09: colors.json.number,
                    base0B: colors.json.string,
                    base0D: colors.primary.copy,
                    tree: () => ({
                      className: 'rounded px-2 pb-2 bg-background-dark',
                    }),
                  }}
                  labelRenderer={([key]) =>
                    key === 'root'
                      ? 'event'
                      : {
                          n: 'name',
                          u: 'url',
                          d: 'domain',
                          w: 'screen_width',
                          r: 'referrer',
                          p: 'props',
                        }[key] ?? key
                  }
                  getItemString={(_, data, itemType, itemString) =>
                    data.n ? (
                      <span>{data.n}</span>
                    ) : (
                      <span>
                        {itemType} {itemString}
                      </span>
                    )
                  }
                  shouldExpandNode={() => true}
                />
              </div>
            </Flipped>
          ))}
        </Flipper>
      </div>
    </div>
  )
}
