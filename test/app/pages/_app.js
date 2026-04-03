import PlausibleProvider from '../../../dist'

export default function App({ Component, pageProps }) {
  return (
    <PlausibleProvider src="https://plausible.io/js/pa-zQPm0mSb_NE1JtAQ6DiwY.js">
      <Component {...pageProps} />
    </PlausibleProvider>
  )
}
