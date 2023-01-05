import React, { ReactNode, useCallback } from 'react'
import Script from 'next/script'
import { NextConfig } from 'next'
import getCombinations from './lib/combinations'

type NextPlausibleProxyOptions = {
  subdirectory?: string
  scriptName?: string
  customDomain?: string
}
type RequiredKeys<T> = {
  [K in keyof Required<T>]-?: T[K] | undefined
}
type NextPlausiblePublicProxyOptions = NextPlausibleProxyOptions & {
  trailingSlash?: boolean
  basePath?: string
}

type NextPlausibleEnv = { next_plausible_proxy: 'true' } & {
  [K in keyof Required<NextPlausiblePublicProxyOptions> as `next_plausible_${K}`]:
    | string
    | undefined
}

const allModifiers = [
  'exclusions',
  'local',
  'manual',
  'outbound-links',
  'file-downloads',
  'tagged-events',
] as const
type ScriptModifier = typeof allModifiers[number]

const getScriptPath = (
  options: NextPlausibleProxyOptions & { basePath?: string },
  ...modifiers: (ScriptModifier | null)[]
) => {
  let basePath = options.basePath ?? ''
  if (options.subdirectory) {
    basePath += `/${options.subdirectory}`
  }
  return `${basePath}/js/${[
    options.scriptName ?? 'script',
    ...modifiers.sort().filter((modifier) => modifier !== null),
  ].join('.')}.js`
}

const plausibleDomain = 'https://plausible.io'

const getRemoteScriptName = (domain: string, selfHosted?: boolean) =>
  selfHosted || domain === plausibleDomain ? 'plausible' : 'index'

const getDomain = (options: { customDomain?: string }) =>
  options.customDomain ?? plausibleDomain

const getApiEndpoint = (options: NextPlausiblePublicProxyOptions) =>
  `${options.basePath ?? ''}/${options.subdirectory ?? 'proxy'}/api/event${
    options.trailingSlash ? '/' : ''
  }`

const getNextPlausibleProxyEnv = (
  options: NextPlausiblePublicProxyOptions
): NextPlausibleEnv => ({
  next_plausible_proxy: 'true',
  next_plausible_trailingSlash: options.trailingSlash ? 'true' : undefined,
  next_plausible_basePath: options.basePath,
  next_plausible_customDomain: options.customDomain,
  next_plausible_scriptName: options.scriptName,
  next_plausible_subdirectory: options.subdirectory,
})

const getNextPlausibleProxyOptions = ():
  | RequiredKeys<NextPlausiblePublicProxyOptions>
  | undefined => {
  if (process.env.next_plausible_proxy) {
    return {
      trailingSlash: process.env.next_plausible_trailingSlash === 'true',
      basePath: process.env.next_plausible_basePath,
      customDomain: process.env.next_plausible_customDomain,
      scriptName: process.env.next_plausible_scriptName,
      subdirectory: process.env.next_plausible_subdirectory,
    }
  }
  return undefined
}

export function withPlausibleProxy(options: NextPlausibleProxyOptions = {}) {
  return (nextConfig: NextConfig): NextConfig => {
    const nextPlausiblePublicProxyOptions: NextPlausiblePublicProxyOptions = {
      ...options,
      trailingSlash: !!nextConfig.trailingSlash,
      basePath: nextConfig.basePath,
    }
    return {
      ...nextConfig,
      env: {
        ...nextConfig.env,
        ...(getNextPlausibleProxyEnv(nextPlausiblePublicProxyOptions) as Record<
          string,
          string
        >),
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
            source: getApiEndpoint({
              ...nextPlausiblePublicProxyOptions,
              basePath: '',
            }),
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
  /**
   * The domain of the site you want to monitor.
   */
  domain: string
  /**
   * Set this if you use a custom domain to serve the analytics script. Defaults to https://plausible.io. See https://plausible.io/docs/custom-domain for more details.
   */
  customDomain?: string

  children?: ReactNode | ReactNode[]
  /**
   * Set this to true if you want to disable automatic pageview events as described here.
   */
  manualPageviews?: boolean
  /**
   * Set this to true if you want to enable localhost tracking as described https://plausible.io/docs/script-extensions.
   */
  trackLocalhost?: boolean
  /**
   * Set this to true if you want to enable outbound link click tracking.
   */
  trackOutboundLinks?: boolean
  /**
   * Set this to true if you want to enable file download tracking as described https://plausible.io/docs/file-downloads-tracking
   */
  trackFileDownloads?: boolean
  /**
   * Set this to true if you want to enable custom event tracking in HTML elements as described https://plausible.io/docs/custom-event-goals
   */
  taggedEvents?: boolean
  /**
   * Set this if you want to exclude a set of pages from being tracked. See https://plausible.io/docs/excluding-pages for more details.
   */
  exclude?: string
  /**
   *  Set this to true if you are self hosting your Plausible instance. Otherwise you will get a 404 when requesting the script.
   */
  selfHosted?: boolean
  /**
   * Use this to explicitly decide whether or not to render script. If not passed the script will be rendered in production environments.
   */
  enabled?: boolean
  /**
   * Optionally define the subresource integrity attribute for extra security. See https://infosec.mozilla.org/guidelines/web_security#subresource-integrity
   */
  integrity?: string
  /**
   * Optionally override any of the props passed to the script element. See example here https://github.com/4lejandrito/next-plausible/blob/master/test/page/pages/scriptProps.js .
   */
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
  const proxyOptions = getNextPlausibleProxyOptions()

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
              props.exclude ? 'exclusions' : null,
              props.trackFileDownloads ? 'file-downloads' : null,
              props.taggedEvents ? 'tagged-events' : null
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
  // https://plausible.io/docs/custom-locations
  u?: string
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
