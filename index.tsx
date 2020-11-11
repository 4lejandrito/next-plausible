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

// https://docs.plausible.io/custom-event-goals#using-custom-props
type EventOptions = {
  props?: Record<string, unknown>
  callback?: VoidFunction
}

export const usePlausible = () => (eventName: string, options?: EventOptions) =>
  (window as any).plausible?.(eventName, options)
