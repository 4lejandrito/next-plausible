import PlausibleProvider from '../../../dist'

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <PlausibleProvider domain="example.com" />
      </head>
      <body>{children}</body>
    </html>
  )
}
