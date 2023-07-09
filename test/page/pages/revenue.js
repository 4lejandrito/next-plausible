import PlausibleProvider from '../../../dist'

export default function Home() {
  return (
    <PlausibleProvider
      domain="example.com"
      revenue
      taggedEvents
      trackLocalhost
      enabled
    >
      <button className="plausible-event-name=Purchase plausible-revenue-amount=10.29 plausible-revenue-currency=EUR" />
    </PlausibleProvider>
  )
}
