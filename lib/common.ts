import crypto from 'crypto'

export type NextPlausibleProxyOptions = {
  subdirectory?: string
  scriptName?: string
  customDomain?: string
}

export type NextPlausiblePublicProxyOptions = NextPlausibleProxyOptions & {
  trailingSlash?: boolean
  basePath?: string
}

export const allModifiers = [
  'exclusions',
  'local',
  'manual',
  'outbound-links',
  'file-downloads',
  'tagged-events',
  'pageview-props',
  'revenue',
  'hash',
] as const

export type ScriptModifier = typeof allModifiers[number]

export const getScriptPath = (
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

export const plausibleDomain = 'https://plausible.io'

export const getRemoteScriptName = (selfHosted?: boolean) =>
  selfHosted ? 'plausible' : 'script'

export const getDomain = (options: { customDomain?: string }) =>
  options.customDomain ?? plausibleDomain

export const getApiEndpoint = (options: NextPlausiblePublicProxyOptions) =>
  `${options.basePath ?? ''}/${options.subdirectory ?? 'proxy'}/api/event${
    options.trailingSlash ? '/' : ''
  }`

export const hashObject = (obj: any) =>
  crypto
    .createHash('md5')
    .update(JSON.stringify(obj || {}))
    .digest('hex')
