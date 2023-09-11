const path = require("path")
const TerserPlugin = require("terser-webpack-plugin")

module.exports = (env, argv) => {
  const isProd = argv.mode === "production"
  return {
    entry: "./src/main.js",
    output: {
      filename: "game.js",
      path: path.resolve(__dirname, "dist")
    },
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProd
            }
          }
        })
      ]
    }
  }
}
