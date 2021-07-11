import PlausibleProvider from '../../../dist'

export default function Home() {
  return (
    <PlausibleProvider
      domain="example.com"
      scriptProps={{
        src: '/custom/js/script.js',
        'data-api': '/api/custom/event',
      }}
    />
  )
}
