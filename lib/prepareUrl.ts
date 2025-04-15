export default function prepareUrl(...customQueryParams: string[]) {
  const [url, search] = location.href.split('?')
  const queryParams = new URLSearchParams(search)
  let customUrl = url.replace(/\/$/, '')
  for (const paramName of customQueryParams) {
    const paramValue = queryParams.get(paramName)
    if (paramValue) customUrl = customUrl + '/' + paramValue
  }
  return customUrl
}
