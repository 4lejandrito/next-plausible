import PlausibleProvider from '../../../dist'

export default function Home() {
  return (
    <PlausibleProvider
      domain="example.com"
      pageviewProps
      scriptProps={{
        'event-customProp': 'value',
      }}
      trackLocalhost
      enabled
    />
  )
}
