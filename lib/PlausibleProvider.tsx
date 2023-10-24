import React, { ReactNode } from 'react'
import Script from 'next/script'
import {
  getDomain,
  getApiEndpoint,
  getScriptPath,
  getRemoteScriptName,
  NextPlausiblePublicProxyOptions,
} from './common'

type RequiredKeys<T> = {
  [K in keyof Required<T>]-?: T[K] | undefined
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
   * Set this to true if you want to disable automatic pageview events as described in https://plausible.io/docs/script-extensions#scriptmanualjs.
   */
  manualPageviews?: boolean
  /**
   * Set the custom pageview props (without the event- prefix) if you want to enable if you want to enable custom properties for pageviews as described https://plausible.io/docs/custom-pageview-props.
   */
  pageviewProps?: boolean | { [key: string]: string }
  /**
   *  Set this to true if you want to track ecommerce revenue as described in https://plausible.io/docs/ecommerce-revenue-tracking .
   */
  revenue?: boolean
  /**
   *  Set this to true if you want to use hash-based routing as described in https://plausible.io/docs/hash-based-routing.
   */
  hash?: boolean
  /**
   * Set this to true if you want to enable localhost tracking as described in https://plausible.io/docs/script-extensions.
   */
  trackLocalhost?: boolean
  /**
   * Set this to true if you want to enable outbound link click tracking.
   */
  trackOutboundLinks?: boolean
  /**
   * Set this to true if you want to enable file download tracking as described in https://plausible.io/docs/file-downloads-tracking
   */
  trackFileDownloads?: boolean
  /**
   * Set this to true if you want to enable custom event tracking in HTML elements as described in https://plausible.io/docs/custom-event-goals
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
   * Use this to explicitly decide whether or not to render script. If not passed the script will be rendered in production environments (checking NODE_ENV and VERCEL_ENV).
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
  const proxyOptions:
    | RequiredKeys<NextPlausiblePublicProxyOptions>
    | undefined = process.env.next_plausible_proxy
    ? {
        trailingSlash: process.env.next_plausible_trailingSlash === 'true',
        basePath: process.env.next_plausible_basePath,
        customDomain: process.env.next_plausible_customDomain,
        scriptName: process.env.next_plausible_scriptName,
        subdirectory: process.env.next_plausible_subdirectory,
      }
    : undefined

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
            (proxyOptions ? '' : getDomain(props)) +
            getScriptPath(
              {
                ...proxyOptions,
                scriptName: proxyOptions
                  ? proxyOptions.scriptName
                  : getRemoteScriptName(props.selfHosted),
              },
              props.trackLocalhost ? 'local' : null,
              props.manualPageviews ? 'manual' : null,
              props.pageviewProps ? 'pageview-props' : null,
              props.trackOutboundLinks ? 'outbound-links' : null,
              props.exclude ? 'exclusions' : null,
              props.revenue ? 'revenue' : null,
              props.trackFileDownloads ? 'file-downloads' : null,
              props.taggedEvents ? 'tagged-events' : null,
              props.hash ? 'hash' : null
            )
          }
          integrity={props.integrity}
          crossOrigin={props.integrity ? 'anonymous' : undefined}
          {...(typeof props.pageviewProps === 'object'
            ? Object.fromEntries(
                Object.entries(props.pageviewProps).map(([k, v]) => [
                  `event-${k}`,
                  v,
                ])
              )
            : undefined)}
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
