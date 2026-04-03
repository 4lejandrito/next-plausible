import React, { ReactNode } from 'react'
import Script from 'next/script'

export default function PlausibleProvider(props: {
  /**
   * The site-specific script URL from your Plausible dashboard, e.g. https://plausible.io/js/pa-XXXXX.js.
   * Not required when using withPlausibleProxy.
   */
  src?: string
  /**
   * Options passed to plausible.init().
   */
  init?: {
    /**
     * Set the custom pageview props as described https://plausible.io/docs/custom-props/introduction.
     * If passing a function, it must be self-contained (no references to outer variables)
     * as it is serialized and injected into an inline script.
     */
    customProperties?:
      | { [key: string]: string }
      | ((eventName: string) => { [key: string]: string })
    /**
     * Set a custom tracking endpoint. When using the proxy this is set automatically.
     */
    endpoint?: string
    /**
     * Set this to track file downloads only for certain file types as described in https://plausible.io/docs/file-downloads-tracking#what-if-i-want-to-track-a-different-file-type
     */
    fileDownloads?: {
      fileExtensions: string[]
    }
    /**
     *  Set this to true if you want to use hash-based routing as described in https://plausible.io/docs/hash-based-routing.
     */
    hashBasedRouting?: boolean
    /**
     * Set this to false if you want to disable automatic pageview events as described in https://plausible.io/docs/custom-locations.
     */
    autoCapturePageviews?: boolean
    /**
     * Set this to true if you want to enable localhost tracking.
     */
    captureOnLocalhost?: boolean
  }
  children?: ReactNode | ReactNode[]
  /**
   * Use this to explicitly decide whether or not to render script. If not passed the script will be rendered in production environments (checking NODE_ENV and VERCEL_ENV).
   */
  enabled?: boolean
  /**
   * Optionally define the subresource integrity attribute for extra security. See https://infosec.mozilla.org/guidelines/web_security#subresource-integrity
   */
  integrity?: string
  /**
   * Optionally override any of the props passed to the script element.
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

  const proxyScriptPath = process.env.next_plausible_scriptPath
  const proxyApiPath = process.env.next_plausible_apiPath

  if (props.src && proxyScriptPath) {
    throw new Error('next-plausible: src is already set by withPlausibleProxy')
  }

  const src = proxyScriptPath ?? props.src
  if (!src) {
    throw new Error(
      'next-plausible: src is required when not using withPlausibleProxy'
    )
  }

  const initArgs = (
    Object.entries({
      ...(proxyApiPath ? { endpoint: proxyApiPath } : {}),
      ...props.init,
    }) as [string, unknown][]
  )
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) =>
      typeof v === 'function' ? `${k}: ${v}` : `${k}: ${JSON.stringify(v)}`
    )

  return (
    <>
      {enabled && (
        <Script
          async
          id="next-plausible-script"
          src={src}
          integrity={props.integrity}
          crossOrigin={props.integrity ? 'anonymous' : undefined}
          {...props.scriptProps}
        />
      )}
      {enabled && (
        <Script
          id="next-plausible-init"
          dangerouslySetInnerHTML={{
            __html: `;(window.plausible = window.plausible || function () {
  ;(plausible.q = plausible.q || []).push(arguments)
}), (plausible.init = plausible.init || function (i) {
  plausible.o = i || {}
})
plausible.init(${initArgs.length ? `{${initArgs.join(', ')}}` : ''})`,
          }}
          nonce={props.scriptProps?.nonce}
        />
      )}
      {props.children}
    </>
  )
}
