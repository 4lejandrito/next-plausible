import { useEffect } from 'react'
import PlausibleProvider from '../../../dist'

const index = () => {
  useEffect(() => {
    document.cookie = 'test=test'
  }, [])
  return <PlausibleProvider domain="example.com" trackLocalhost enabled />
}

export default index
