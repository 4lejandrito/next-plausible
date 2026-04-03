import Head from 'next/head'
import PlausibleProvider from '../next-plausible/index.esm'
import { NextSeo } from 'next-seo'
import 'tailwindcss/tailwind.css'

const domain = 'next-plausible.vercel.app'
const title = 'Next-Plausible'
const description =
  'Simple integration for https://plausible.io analytics and https://nextjs.org'

export default function App({ Component, pageProps }) {
  return (
    <PlausibleProvider
      enabled={process.env.NODE_ENV !== 'production' || undefined}
      init={
        process.env.NODE_ENV !== 'production'
          ? { captureOnLocalhost: true }
          : undefined
      }
    >
      <Head>
        <link rel="shortcut icon" href="/next-plausible.png" />
      </Head>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          url: `https://${domain}`,
          title,
          description,
          images: [
            {
              url: `https://${domain}/next-plausible.png`,
              alt: title,
            },
          ],
          site_name: domain,
        }}
      />
      <Component {...pageProps} domain={domain} />
    </PlausibleProvider>
  )
}
