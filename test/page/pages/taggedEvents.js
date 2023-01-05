import PlausibleProvider from '../../../dist'

export default function Home() {
  return (
    <PlausibleProvider domain="example.com" taggedEvents trackLocalhost enabled>
      <button className="plausible-event-name=CustomEventName plausible-event-prop=value" />
    </PlausibleProvider>
  )
}
