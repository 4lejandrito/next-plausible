'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

var React = require('react')
var Head = require('next/head')
var getConfig = require('next/config')

function _interopDefaultLegacy(e) {
  return e && typeof e === 'object' && 'default' in e ? e : { default: e }
}

var React__default = /*#__PURE__*/ _interopDefaultLegacy(React)
var Head__default = /*#__PURE__*/ _interopDefaultLegacy(Head)
var getConfig__default = /*#__PURE__*/ _interopDefaultLegacy(getConfig)

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P
      ? value
      : new P(function (resolve) {
          resolve(value)
        })
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value))
      } catch (e) {
        reject(e)
      }
    }
    function rejected(value) {
      try {
        step(generator['throw'](value))
      } catch (e) {
        reject(e)
      }
    }
    function step(result) {
      result.done
        ? resolve(result.value)
        : adopt(result.value).then(fulfilled, rejected)
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}

const getScriptPath = (options, ...modifiers) => {
  var _a
  const basePath = `/js/${[
    (_a = options.scriptName) !== null && _a !== void 0 ? _a : 'script',
    ...modifiers.filter((modifier) => modifier !== null),
  ].join('.')}.js`
  if (options.subdirectory) {
    return `/${options.subdirectory}${basePath}`
  } else {
    return basePath
  }
}
const plausibleDomain = 'https://plausible.io'
const getRemoteScriptName = (domain, selfHosted) =>
  selfHosted || domain === plausibleDomain ? 'plausible' : 'index'
const getDomain = (options) => {
  var _a
  return (_a = options.customDomain) !== null && _a !== void 0
    ? _a
    : plausibleDomain
}
const getApiEndpoint = (options) =>
  options.subdirectory ? `/${options.subdirectory}/api/event` : '/api/event'
function withPlausibleProxy(options = {}) {
  return (nextConfig) =>
    Object.assign(Object.assign({}, nextConfig), {
      publicRuntimeConfig: Object.assign(
        Object.assign({}, nextConfig.publicRuntimeConfig),
        { nextPlausibleProxyOptions: options }
      ),
      rewrites: () =>
        __awaiter(this, void 0, void 0, function* () {
          var _a
          const domain = getDomain(options)
          const getRemoteScript = (...modifiers) =>
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
            {
              source: getScriptPath(options, 'local'),
              destination: getRemoteScript('local'),
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
              source: getApiEndpoint(options),
              destination: `${domain}/api/event`,
            },
          ]
          const rewrites = yield (_a = nextConfig.rewrites) === null ||
          _a === void 0
            ? void 0
            : _a.call(nextConfig)
          if (!rewrites) {
            return plausibleRewrites
          } else if (Array.isArray(rewrites)) {
            return rewrites.concat(plausibleRewrites)
          } else {
            rewrites.afterFiles = rewrites.afterFiles.concat(plausibleRewrites)
            return rewrites
          }
        }),
    })
}
function PlausibleProvider(props) {
  var _a, _b
  const { enabled = process.env.NODE_ENV === 'production' } = props
  const domain = getDomain(props)
  const proxyOptions =
    (_b =
      (_a = getConfig__default['default']()) === null || _a === void 0
        ? void 0
        : _a.publicRuntimeConfig) === null || _b === void 0
      ? void 0
      : _b.nextPlausibleProxyOptions
  return React__default['default'].createElement(
    React__default['default'].Fragment,
    null,
    React__default['default'].createElement(
      Head__default['default'],
      null,
      enabled &&
        React__default['default'].createElement(
          'script',
          Object.assign(
            {
              async: true,
              defer: true,
              'data-api': proxyOptions
                ? getApiEndpoint(proxyOptions)
                : undefined,
              'data-domain': props.domain,
              'data-exclude': props.exclude,
              src:
                (proxyOptions ? '' : domain) +
                getScriptPath(
                  Object.assign(Object.assign({}, proxyOptions), {
                    scriptName: proxyOptions
                      ? proxyOptions.scriptName
                      : getRemoteScriptName(domain, props.selfHosted),
                  }),
                  props.trackLocalhost ? 'local' : null,
                  props.trackOutboundLinks ? 'outbound-links' : null,
                  props.exclude ? 'exclusions' : null
                ),
              integrity: props.integrity,
              crossOrigin: props.integrity ? 'anonymous' : undefined,
            },
            props.scriptProps
          )
        ),
      React__default['default'].createElement('script', {
        dangerouslySetInnerHTML: {
          __html: `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`,
        },
      })
    ),
    props.children
  )
}
function usePlausible() {
  return function (eventName, ...rest) {
    var _a, _b
    return (_b = (_a = window).plausible) === null || _b === void 0
      ? void 0
      : _b.call(_a, eventName, rest[0])
  }
}

exports['default'] = PlausibleProvider
exports.usePlausible = usePlausible
exports.withPlausibleProxy = withPlausibleProxy
//# sourceMappingURL=index.js.map
