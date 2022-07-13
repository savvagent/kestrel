import { build } from 'esbuild'
import { resolve } from 'path'

const browserConfig = {
  bundle: true,
  entryPoints: [resolve('src', 'index.js')],
  format: 'esm',
  minify: true,
  sourcemap: true,
  outfile: resolve('dist', 'kestrel.js'),
}

const cjsConfig = {
  ...browserConfig,
  ...{
    format: 'cjs',
    minify: false,
    sourcemap: false,
    outfile: 'index.js',
    target: ['node14.0'],
  }
}

const mjsConfig = {
  ...cjsConfig,
  ...{
    format: 'esm',
    outfile: 'index.mjs'
  }
}

const testConfig = {
  bundle: true,
  entryPoints: [resolve('test', 'browser.js')],
  format: 'esm',
  minify: false,
  outfile: resolve('test', 'browser-bundle.js'),
  sourcemap: false,
}

Promise.all([
  build(browserConfig),
  build(cjsConfig),
  build(mjsConfig),
  build(testConfig)
])
  .catch((err) => console.log('err', err))
