import PlausibleProvider from '../../../dist'

export default function App({ Component, pageProps }) {
  return (
    <PlausibleProvider domain="example.com">
      <Component {...pageProps} />
    </PlausibleProvider>
  )
}
