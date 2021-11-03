import getCombinations from '../../lib/combinations'

describe('getCombinations', () => {
  it('returns the combinations of 0 elements', () => {
    expect(getCombinations([])).toEqual([])
  })
  it('returns the combinations of 1 element', () => {
    expect(getCombinations([1])).toEqual([[1]])
  })
  it('returns the combinations of 2 elements', () => {
    expect(getCombinations([1, 2])).toEqual([[1], [1, 2], [2]])
  })
  it('returns the combinations of 3 elements', () => {
    expect(getCombinations([1, 2, 3])).toEqual([
      [1],
      [1, 2],
      [1, 2, 3],
      [1, 3],
      [2],
      [2, 3],
      [3],
    ])
  })
})
