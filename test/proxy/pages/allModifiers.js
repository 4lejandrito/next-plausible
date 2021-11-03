import PlausibleProvider from '../../../dist'

export default function Home() {
  return (
    <PlausibleProvider
      domain="example.com"
      trackLocalhost
      trackOutboundLinks
      manualPageviews
      exclude="page"
    />
  )
}
