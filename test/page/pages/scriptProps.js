import PlausibleProvider from '../../../dist'

export default function Home() {
  return (
    <PlausibleProvider
      src="https://plausible.io/js/pa-zQPm0mSb_NE1JtAQ6DiwY.js"
      scriptProps={{
        src: '/custom/js/script.js',
        nonce: 'test',
      }}
    />
  )
}
