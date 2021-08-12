import React, { ReactNode } from 'react'
import Head from 'next/head'
import { NextConfig } from 'next/dist/next-server/server/config-shared'
import getConfig from 'next/config'

type NextPlausibleProxyOptions = {
  subdirectory?: string
  scriptName?: string
  customDomain?: string
}

type ScriptModifier = 'exclusions' | 'outbound-links'

const getScriptPath = (
  options: NextPlausibleProxyOptions,
  ...modifiers: (ScriptModifier | null)[]
) => {
  const basePath = `/js/${[
    options.scriptName ?? 'script',
    ...modifiers.filter((modifier) => modifier !== null),
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

export function withPlausibleProxy(options: NextPlausibleProxyOptions = {}) {
  return (nextConfig: NextConfig): NextConfig => ({
    ...nextConfig,
    publicRuntimeConfig: {
      ...nextConfig.publicRuntimeConfig,
      nextPlausibleProxyOptions: options,
    },
    rewrites: async () => {
      const domain = getDomain(options)
      const getRemoteScript = (...modifiers: (ScriptModifier | null)[]) =>
        domain +
        getScriptPath(
          {
            scriptName: getRemoteScriptName(domain, domain !== plausibleDomain),
          },
          ...modifiers
        )
      const plausibleRewrites = [
        {
          source: getScriptPath(options),
          destination: getRemoteScript(),
        },
        {
          source: getScriptPath(options, 'exclusions'),
          destination: getRemoteScript('exclusions'),
        },
        {
          source: getScriptPath(options, 'outbound-links'),
          destination: getRemoteScript('outbound-links'),
        },
        {
          source: getScriptPath(options, 'outbound-links', 'exclusions'),
          destination: getRemoteScript('outbound-links', 'exclusions'),
        },
        {
          source: options.subdirectory
            ? `/${options.subdirectory}/api/event`
            : '/api/event',
          destination: `${domain}/api/event`,
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
  scriptProps?: React.DetailedHTMLProps<
    React.ScriptHTMLAttributes<HTMLScriptElement>,
    HTMLScriptElement
  >
}) {
  const { enabled = process.env.NODE_ENV === 'production' } = props
  const domain = getDomain(props)
  const proxyOptions: NextPlausibleProxyOptions | undefined =
    getConfig()?.publicRuntimeConfig?.nextPlausibleProxyOptions

  return (
    <>
      <Head>
        {enabled && (
          <script
            async
            defer
            data-api={
              proxyOptions?.subdirectory
                ? `/${proxyOptions.subdirectory}/api/event`
                : undefined
            }
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
                props.trackOutboundLinks ? 'outbound-links' : null,
                props.exclude ? 'exclusions' : null
              )
            }
            integrity={props.integrity}
            crossOrigin={props.integrity ? 'anonymous' : undefined}
            {...props.scriptProps}
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
