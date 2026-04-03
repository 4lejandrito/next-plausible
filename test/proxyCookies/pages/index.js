import { useEffect } from 'react'
import PlausibleProvider from '../../../dist'

const index = () => {
  useEffect(() => {
    document.cookie = 'test=test'
  }, [])
  return <PlausibleProvider enabled init={{ captureOnLocalhost: true }} />
}

export default index
