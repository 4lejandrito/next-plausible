import type { Config } from 'jest'

const config: Config = {
  transform: {
    '^.+\\.(j|t)s?$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!caller-path|caller-callsite|callsites)',
  ],
  preset: 'ts-jest/presets/js-with-ts',
  moduleFileExtensions: ['ts', 'js'],
  testTimeout: 60000,
}

export default config
