import PlausibleProvider from '../../../dist'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <PlausibleProvider init={{ captureOnLocalhost: true }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
