import PlausibleProvider from '../next-plausible/index.esm'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider
          enabled={process.env.NODE_ENV !== 'production' || undefined}
          init={
            process.env.NODE_ENV !== 'production'
              ? { captureOnLocalhost: true }
              : undefined
          }
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
