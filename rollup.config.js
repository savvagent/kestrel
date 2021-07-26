import { liveServer } from 'rollup-plugin-live-server';
import { resolve } from 'path';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';

const root = process.cwd();
const client = resolve(root, 'src', 'client.js');
const server = resolve(root, 'src', 'server.js');

const production = !process.env.ROLLUP_WATCH;

const devServerConfig = {
  file: 'mocha.html',
  port: 8080,
  host: '0.0.0.0',
  root: './test',
  mount: [
    ['/dist', './dist'],
    ['/node_modules', './node_modules'],
    ['/src', './src'],
    ['/test', './test']
  ],
  open: false,
  wait: 500
};

const plugins = [nodeResolve(), commonJs(), json()];

export default [
{
    input: client,
    output: {
      file: resolve(root, 'dist', 'kestrel.js'),
      format: 'esm'
    }
  },
  {
    input: client,
    plugins: [terser()],
    output: {
      file: resolve(root, 'dist', 'kestrel.min.js'),
      format: 'esm'
    }
  },
  {
    input: resolve(root, 'interceptors', 'json-request.js'),
    plugins: [],
    output: {
      file: resolve(root, 'dist', 'json-request.js'),
      format: 'esm'
    }
  },
  {
    input: resolve(root, 'interceptors', 'json-request.js'),
    plugins: [terser()],
    output: {
      file: resolve(root, 'dist', 'json-request.min.js'),
      format: 'esm'
    }
  },
  {
    input: resolve(root, 'interceptors', 'json-response.js'),
    plugins: [],
    output: {
      file: resolve(root, 'dist', 'json-response.js'),
      format: 'esm'
    }
  },
  {
    input: resolve(root, 'interceptors', 'json-response.js'),
    plugins: [terser()],
    output: {
      file: resolve(root, 'dist', 'json-response.min.js'),
      format: 'esm'
    }
  },
  {
    input: resolve(root, 'interceptors', 'reject-errors.js'),
    plugins: [],
    output: {
      file: resolve(root, 'dist', 'reject-errors.js'),
      format: 'esm'
    }
  },
  {
    input: resolve(root, 'interceptors', 'reject-errors.js'),
    plugins: [terser()],
    output: {
      file: resolve(root, 'dist', 'reject-errors.min.js'),
      format: 'esm'
    }
  },
  {
    input: resolve(root, 'interceptors', 'bust-cache.js'),
    plugins: [],
    output: {
      file: resolve(root, 'dist', 'bust-cache.js'),
      format: 'esm'
    }
  },
  {
    input: resolve(root, 'interceptors', 'bust-cache.js'),
    plugins: [terser()],
    output: {
      file: resolve(root, 'dist', 'bust-cache.min.js'),
      format: 'esm'
    }
  },
  {
    input: resolve(root, 'interceptors', 'index.js'),
    plugins: [],
    output: {
      file: resolve(root, 'dist', 'all-interceptors.js'),
      format: 'esm'
    }
  },
  {
    input: resolve(root, 'interceptors', 'index.js'),
    plugins: [terser()],
    output: {
      file: resolve(root, 'dist', 'all-interceptors.min.js'),
      format: 'esm'
    }
  },
{
    input: server,
    output: {
      file: resolve(root, 'index.js'),
      format: 'cjs'
    }
  },
{
    input: server,
    output: {
      file: resolve(root, 'index.mjs'),
      format: 'esm'
    }
  },
  {
    input: resolve(root, 'test', 'browser.js'),
    plugins: [nodeResolve(), json(), !production && liveServer(devServerConfig)],
    output: {
      file: resolve(root, 'test', 'browser-bundle.js'),
      format: 'esm'
    }
  },
  {
    input: resolve(root, 'test', 'tests.js'),
    output: {
      file: resolve(root, 'test', 'server-bundle.js'),
      format: 'cjs'
    }
  }
];
