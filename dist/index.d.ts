import React, { ReactNode } from 'react'
import { NextConfig } from 'next'
declare type NextPlausibleProxyOptions = {
  subdirectory?: string
  scriptName?: string
  customDomain?: string
}
export declare function withPlausibleProxy(
  options?: NextPlausibleProxyOptions
): (nextConfig: NextConfig) => NextConfig
export default function PlausibleProvider(props: {
  domain: string
  customDomain?: string
  children: ReactNode | ReactNode[]
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
}): JSX.Element
declare type Props = Record<string, unknown> | never
declare type EventOptions<P extends Props> = {
  props: P
  callback?: VoidFunction
}
declare type EventOptionsTuple<P extends Props> = P extends never
  ? [Omit<EventOptions<P>, 'props'>?]
  : [EventOptions<P>]
declare type Events = {
  [K: string]: Props
}
export declare function usePlausible<E extends Events = any>(): <
  N extends keyof E
>(
  eventName: N,
  ...rest: EventOptionsTuple<E[N]>
) => any
export {}
