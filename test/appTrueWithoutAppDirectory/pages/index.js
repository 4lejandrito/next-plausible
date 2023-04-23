import PlausibleProvider, { usePlausible } from '../../../dist'

const index = () => {
  const plausible = usePlausible()
  return <PlausibleProvider domain="example.com" />
}

export default index
