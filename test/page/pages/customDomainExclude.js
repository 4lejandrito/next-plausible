import PlausibleProvider from '../../../dist'

export default function Home() {
  return (
    <PlausibleProvider
      domain="example.com"
      customDomain="https://custom.example.com"
      exclude="page"
    />
  )
}
