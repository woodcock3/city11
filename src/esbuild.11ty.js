const esbuild = require('esbuild')
const glob = require('glob-all') // to enable * glob pattern in esbuild
const isProd = process.env.ELEVENTY_ENV === 'prod' ? true : false

module.exports = class {
  data() {
    return {
      permalink: false,
      eleventyExcludeFromCollections: true
    }
  }

  async render() {
    await esbuild.build({
      entryPoints: glob.sync(['assets/css/*.css', 'assets/js/*.js']),
      bundle: true,
      minify: isProd,
      outdir: './dist/assets',
      sourcemap: !isProd,
      target: isProd ? 'es6' : 'esnext'
    })
  }
}
