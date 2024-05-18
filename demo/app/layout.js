import PlausibleProvider from '../next-plausible/index.esm'

export default function RootLayout({ children }) {
  const domain =
    process.env.NODE_ENV === 'production'
      ? 'next-plausible.vercel.app'
      : 'localhost:3000'
  return (
    <html lang="en">
      <head>
        <PlausibleProvider
          domain={domain}
          trackOutboundLinks
          trackFileDownloads
          enabled={domain.indexOf('localhost') !== -1 || undefined}
          trackLocalhost={domain.indexOf('localhost') !== -1}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
