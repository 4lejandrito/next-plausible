/**
 * @jest-environment jsdom
 */
import { describe, it, expect } from '@jest/globals'
import prepareUrl from '../../lib/prepareUrl'

describe('prepareURl', () => {
  it('turns query params into path params', () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      enumerable: true,
      value: new URL('http://foo/bar?param1=1&param2=2'),
    })
    expect(prepareUrl()).toEqual('http://foo/bar')
    expect(prepareUrl('param3')).toEqual('http://foo/bar')
    expect(prepareUrl('param1')).toEqual('http://foo/bar/1')
    expect(prepareUrl('param1', 'param2')).toEqual('http://foo/bar/1/2')
    expect(prepareUrl('param1', 'param2', 'param3')).toEqual(
      'http://foo/bar/1/2'
    )
  })
})
