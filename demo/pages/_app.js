import Head from 'next/head'
import PlausibleProvider from '../next-plausible/index.esm'
import { NextSeo } from 'next-seo'
import 'tailwindcss/tailwind.css'

export default function App({ Component, pageProps }) {
  const domain =
    process.env.NODE_ENV === 'production'
      ? 'next-plausible.vercel.app'
      : 'localhost:3000'
  const title = 'Next-Plausible'
  const description =
    'Simple integration for https://plausible.io analytics and https://nextjs.org'
  return (
    <PlausibleProvider
      domain={domain}
      trackOutboundLinks
      trackFileDownloads
      enabled={domain.indexOf('localhost') !== -1 || undefined}
      trackLocalhost={domain.indexOf('localhost') !== -1}
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
