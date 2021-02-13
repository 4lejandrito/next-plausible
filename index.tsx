import React, { ReactNode } from 'react'
import Head from 'next/head'

export default function PlausibleProvider(props: {
  domain: string
  customDomain?: string
  children: ReactNode | ReactNode[]
  exclude?: string
  selfHosted?: boolean
  enabled?: boolean
  integrity?: string
}) {
  const {
    customDomain = 'https://plausible.io',
    enabled = process.env.NODE_ENV === 'production'
  } = props
  return (
    <>
      <Head>
        {enabled && (
          <script
            async
            defer
            data-domain={props.domain}
            data-exclude={props.exclude}
            src={`${customDomain}/js/${
              props.selfHosted || customDomain === 'https://plausible.io'
                ? 'plausible'
                : 'index'
            }${props.exclude ? '.exclusions' : ''}.js`}
            integrity={props.integrity}
            crossOrigin={props.integrity ? 'anonymous' : undefined}
          />
        )}
      </Head>
      {props.children}
    </>
  )
}

// https://docs.plausible.io/custom-event-goals#using-custom-props
type Props = Record<string, unknown> | never
type EventOptions<P extends Props> = {
  props: P
  callback?: VoidFunction
}
type EventOptionsTuple<P extends Props> = P extends never
  ? [Omit<EventOptions<P>, 'props'>?]
  : [EventOptions<P>]
type Events = { [K: string]: Props }

export function usePlausible<E extends Events = any>() {
  return function<N extends keyof E>(
    eventName: N,
    ...rest: EventOptionsTuple<E[N]>
  ) {
    return (window as any).plausible?.(eventName, rest[0])
  }
}
