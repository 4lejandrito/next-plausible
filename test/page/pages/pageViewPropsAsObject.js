import PlausibleProvider from '../../../dist'

export default function Home() {
  return (
    <PlausibleProvider
      domain="example.com"
      pageviewProps={{
        customprop: 'value',
      }}
      trackLocalhost
      enabled
    />
  )
}
