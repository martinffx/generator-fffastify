import esbuild from "esbuild"
import copyStaticFiles from "esbuild-copy-static-files"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import chokidar from 'chokidar'
import esbuildPluginPino from 'esbuild-plugin-pino'

const isProd = process.env.NODE_ENV === 'production';
const argv = yargs(hideBin(process.argv))
  .option("watch", {
    alias: "w",
    description: "watch for changes",
    type: "boolean",
    default: false,
  })
  .option("source-map", {
    alias: "s",
    description: "watch for changes",
    type: "boolean",
    default: false,
  })
  .option("minify", {
    alias: "m",
    description: "minify bundle",
    type: "boolean",
    default: false,
  })
  .help()
  .alias("help", "h").argv

const build = () => {
  esbuild.build({
    entryPoints: ["./src/index.ts",],
    outdir: `./dist`,
    bundle: true,
    minify: argv.minify,
    sourcemap: argv["source-map"],
    platform: "node",
    target: "node18",
    logLevel: "info",
    color: true,
    plugins: [
      copyStaticFiles({
        src: "./templates",
        dest: `./dist/templates`,
        recursive: true,
      }),
      copyStaticFiles({
        src: "./static",
        dest: `./dist/static`,
        recursive: true,
      }),
      copyStaticFiles({
        src: "./node_modules/redoc/bundles/redoc.standalone.js",
        dest: `./dist/static/redoc.standalone.js`,
      }),
      esbuildPluginPino({
        transports: isProd ? ['pino-sentry-transport'] : ['pino-pretty']
      }),
    ],
  })
}
build()

if (argv.watch) {
  chokidar
    .watch(['./src', './templates', './static'], {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    })
    .on('change', (path) => {
      build()
    })
}
