export default function getCombinations<T>(elements: readonly T[]): T[][] {
  const combinations: T[][] = []

  for (let i = 0; i < elements.length; i++) {
    combinations.push([elements[i]])
    if (i < elements.length - 1) {
      getCombinations(elements.slice(i + 1)).forEach((combination) => {
        combinations.push([elements[i], ...combination])
      })
    }
  }

  return combinations
}
