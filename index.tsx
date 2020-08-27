import React, { ReactNode } from 'react'
import Head from 'next/head'

export default function PlausibleProvider(props: {
  domain: string
  children: ReactNode | ReactNode[]
}) {
  return (
    <>
      <Head>
        {process.env.NODE_ENV === 'production' && (
          <script
            async
            defer
            data-domain={props.domain}
            src="https://plausible.io/js/plausible.js"
          />
        )}
      </Head>
      {props.children}
    </>
  )
}

export const usePlausible = () => (event: string) =>
  (window as any).plausible?.(event)
