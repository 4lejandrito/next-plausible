import React, { ReactNode, useCallback } from 'react'
import Script from 'next/script'
import { NextConfig } from 'next'
import getConfig from 'next/config'
import getCombinations from './lib/combinations'

type NextPlausibleProxyOptions = {
  subdirectory?: string
  scriptName?: string
  customDomain?: string
}
type NextPlausiblePublicProxyOptions = NextPlausibleProxyOptions & {
  trailingSlash: boolean
}

const allModifiers = [
  'exclusions',
  'local',
  'manual',
  'outbound-links',
] as const
type ScriptModifier = typeof allModifiers[number]

const getScriptPath = (
  options: NextPlausibleProxyOptions,
  ...modifiers: (ScriptModifier | null)[]
) => {
  const basePath = `/js/${[
    options.scriptName ?? 'script',
    ...modifiers.sort().filter((modifier) => modifier !== null),
  ].join('.')}.js`
  if (options.subdirectory) {
    return `/${options.subdirectory}${basePath}`
  } else {
    return basePath
  }
}

const plausibleDomain = 'https://plausible.io'

const getRemoteScriptName = (domain: string, selfHosted?: boolean) =>
  selfHosted || domain === plausibleDomain ? 'plausible' : 'index'

const getDomain = (options: { customDomain?: string }) =>
  options.customDomain ?? plausibleDomain

const getApiEndpoint = (options: NextPlausiblePublicProxyOptions) =>
  `/${options.subdirectory ?? 'proxy'}/api/event${
    options.trailingSlash ? '/' : ''
  }`

export function withPlausibleProxy(options: NextPlausibleProxyOptions = {}) {
  return (nextConfig: NextConfig): NextConfig => {
    const nextPlausiblePublicProxyOptions: NextPlausiblePublicProxyOptions = {
      ...options,
      trailingSlash: !!nextConfig.trailingSlash,
    }
    return {
      ...nextConfig,
      publicRuntimeConfig: {
        ...nextConfig.publicRuntimeConfig,
        nextPlausiblePublicProxyOptions,
      },
      rewrites: async () => {
        const domain = getDomain(options)
        const getRemoteScript = (...modifiers: (ScriptModifier | null)[]) =>
          domain +
          getScriptPath(
            {
              scriptName: getRemoteScriptName(
                domain,
                domain !== plausibleDomain
              ),
            },
            ...modifiers
          )
        const plausibleRewrites = [
          {
            source: getScriptPath(options),
            destination: getRemoteScript(),
          },
          ...getCombinations(allModifiers).map((modifiers) => ({
            source: getScriptPath(options, ...modifiers),
            destination: getRemoteScript(...modifiers),
          })),
          {
            source: getApiEndpoint(nextPlausiblePublicProxyOptions),
            destination: `${domain}/api/event`,
          },
        ]

        if (process.env.NEXT_PLAUSIBLE_DEBUG) {
          console.log('plausibleRewrites = ', plausibleRewrites)
        }

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
    }
  }
}

export default function PlausibleProvider(props: {
  domain: string
  customDomain?: string
  children: ReactNode | ReactNode[]
  manualPageviews?: boolean
  trackLocalhost?: boolean
  trackOutboundLinks?: boolean
  exclude?: string
  selfHosted?: boolean
  enabled?: boolean
  integrity?: string
  scriptProps?: React.DetailedHTMLProps<
    React.ScriptHTMLAttributes<HTMLScriptElement>,
    HTMLScriptElement
  >
}) {
  const {
    enabled = process.env.NODE_ENV === 'production' &&
      (!process.env.NEXT_PUBLIC_VERCEL_ENV ||
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'),
  } = props
  const domain = getDomain(props)
  const proxyOptions: NextPlausiblePublicProxyOptions | undefined =
    getConfig()?.publicRuntimeConfig?.nextPlausiblePublicProxyOptions

  return (
    <>
      {enabled && (
        <Script
          async
          defer
          data-api={proxyOptions ? getApiEndpoint(proxyOptions) : undefined}
          data-domain={props.domain}
          data-exclude={props.exclude}
          src={
            (proxyOptions ? '' : domain) +
            getScriptPath(
              {
                ...proxyOptions,
                scriptName: proxyOptions
                  ? proxyOptions.scriptName
                  : getRemoteScriptName(domain, props.selfHosted),
              },
              props.trackLocalhost ? 'local' : null,
              props.manualPageviews ? 'manual' : null,
              props.trackOutboundLinks ? 'outbound-links' : null,
              props.exclude ? 'exclusions' : null
            )
          }
          integrity={props.integrity}
          crossOrigin={props.integrity ? 'anonymous' : undefined}
          {...props.scriptProps}
        />
      )}
      {enabled && (
        <Script
          id="next-plausible-init"
          dangerouslySetInnerHTML={{
            __html: `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`,
          }}
        />
      )}
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
  return useCallback(function <N extends keyof E>(
    eventName: N,
    ...rest: EventOptionsTuple<E[N]>
  ) {
    return (window as any).plausible?.(eventName, rest[0])
  },
  [])
}
