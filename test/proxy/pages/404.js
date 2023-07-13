import { useEffect } from 'react'
import PlausibleProvider, { usePlausible } from '../../../dist'

function Page() {
  const plausible = usePlausible()

  useEffect(() => {
    plausible('Page Not Found', {
      props: { page: document.location.pathname },
    })
  }, [plausible])

  return <div>:(</div>
}

export default function Custom404() {
  return (
    <PlausibleProvider domain="example.com" trackLocalhost enabled>
      <Page />
    </PlausibleProvider>
  )
}
