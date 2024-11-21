import { useEffect } from 'react'
import PlausibleProvider, { usePlausible, prepareUrl } from '../../../dist'

function Page() {
  const plausible = usePlausible()

  useEffect(() => {
    plausible('pageview', {
      u: prepareUrl('param1', 'param2'),
    })
  }, [plausible])

  return <div>:)</div>
}

export default function Home() {
  return (
    <PlausibleProvider
      domain="example.com"
      trackLocalhost
      enabled
      manualPageviews
    >
      <Page />
    </PlausibleProvider>
  )
}
