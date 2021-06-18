import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

export default {
  input: 'index.tsx',
  output: [
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
  ],
  plugins: [typescript()],
  external: [...Object.keys(pkg.peerDependencies)],
}
