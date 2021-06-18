import React, { ReactNode } from 'react'
import Head from 'next/head'
import { NextConfig } from 'next/dist/next-server/server/config-shared'
import getConfig from 'next/config'

export function withPlausibleProxy() {
  return (nextConfig: NextConfig): NextConfig => ({
    ...nextConfig,
    publicRuntimeConfig: {
      ...nextConfig.publicRuntimeConfig,
      plausibleProxy: true,
    },
    rewrites: async () => {
      const plausibleRewrites = [
        {
          source: '/js/plausible.exclusions.js',
          destination: 'https://plausible.io/js/plausible.exclusions.js',
        },
        {
          source: '/js/plausible.outbound-links.js',
          destination: 'https://plausible.io/js/plausible.outbound-links.js',
        },
        {
          source: '/js/plausible.outbound-links.exclusions.js',
          destination:
            'https://plausible.io/js/plausible.outbound-links.exclusions.js',
        },
        {
          source: '/js/plausible.js',
          destination: 'https://plausible.io/js/plausible.js',
        },
        {
          source: '/api/event',
          destination: 'https://plausible.io/api/event',
        },
      ]
      const rewrites = await nextConfig.rewrites?.()

      if (!rewrites) {
        return plausibleRewrites
      } else if (Array.isArray(rewrites)) {
        return rewrites.concat(plausibleRewrites)
      } else {
        rewrites.afterFiles = rewrites.afterFiles.concat(plausibleRewrites)
        return rewrites
      }
    },
  })
}

export default function PlausibleProvider(props: {
  domain: string
  customDomain?: string
  children: ReactNode | ReactNode[]
  trackOutboundLinks?: boolean
  exclude?: string
  selfHosted?: boolean
  enabled?: boolean
  integrity?: string
}) {
  const hasProxy = getConfig()?.publicRuntimeConfig?.plausibleProxy
  const {
    customDomain = hasProxy ? '' : 'https://plausible.io',
    enabled = process.env.NODE_ENV === 'production',
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
              props.selfHosted ||
              customDomain === 'https://plausible.io' ||
              hasProxy
                ? 'plausible'
                : 'index'
            }${props.trackOutboundLinks ? '.outbound-links' : ''}${
              props.exclude ? '.exclusions' : ''
            }.js`}
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
  return function <N extends keyof E>(
    eventName: N,
    ...rest: EventOptionsTuple<E[N]>
  ) {
    return (window as any).plausible?.(eventName, rest[0])
  }
}
