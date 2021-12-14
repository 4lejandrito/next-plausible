import PlausibleProvider from '../../../dist'
import Image from 'next/image'

export default function Home() {
  return (
    <PlausibleProvider domain="example.com" trackOutboundLinks exclude="page">
      <Image
        className="test"
        src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
        layout="fill"
      />
    </PlausibleProvider>
  )
}
