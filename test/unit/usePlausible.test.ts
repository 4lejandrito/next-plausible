/**
 * @jest-environment jsdom
 */
import { describe, it } from '@jest/globals'
import usePlausible from '../../lib/usePlausible'
import { renderHook } from '@testing-library/react'

describe('usePlausible', () => {
  it('allows any props if no type parameter is set', () => {
    const {
      result: { current: plausible },
    } = renderHook(() => usePlausible())

    plausible('someEvent', { revenue: { currency: 'EUR', amount: 0 } })
    plausible('someEvent', { props: { a: 'a' } })

    // @ts-expect-error
    plausible('someEvent', { a: 'a' })
  })

  it('is type safe when using a type parameter', () => {
    type Events = {
      someEvent: never
      e: { a: string; b: number }
    }
    const {
      result: { current: plausible },
    } = renderHook(() => usePlausible<Events>())

    // happy cases -> correct function calls
    plausible('someEvent')
    plausible('someEvent', { revenue: { currency: 'EUR', amount: 0 } })
    plausible('e', { props: { a: 'a', b: 0 } })
    plausible('e', {
      props: { a: 'a', b: 0 },
      revenue: { currency: 'EUR', amount: 0 },
    })

    // falsy function calls -> typescript will error here

    // @ts-expect-error
    plausible('e')
    // @ts-expect-error
    plausible('e', { props: { a: 0 } })
    // @ts-expect-error
    plausible('e', { props: { a: 'a' } })
    // @ts-expect-error
    plausible('e', { props: { a: 'a', b: 'b' } })
    // @ts-expect-error
    plausible('a', { props: { a: 'a', b: 0 } })
    // @ts-expect-error
    plausible('e', {
      revenue: { currency: 'EUR', amount: 0 },
    })
  })
})
