const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

const productionGzipExtensions = ["js", "css"];
const isProduction = process.env.NODE_ENV === "production";
const useAnalyzer = process.env.USE_ANALYZER === "true";

// ── Dev proxy target — reads from .env.development ─────────────────────────
const backendOrigin =
  `http://${process.env.VUE_APP_BACKEND_IP || "127.0.0.1"}` +
  `:${process.env.VUE_APP_BACKEND_PORT || 16666}`;

const proxyPaths = ["/blog_api", "/jio_api", "/blog_image", "/trivials"];
const devProxy = Object.fromEntries(
  proxyPaths.map((path) => [
    path,
    {
      target: backendOrigin,
      changeOrigin: true,
    },
  ])
);

module.exports = defineConfig({
  devServer: {
    port: parseInt(process.env.VUE_APP_FRONTEND_PORT || "8080", 10),
    client: {
      overlay: false,
    },
    compress: true,
    proxy: devProxy,
  },

  transpileDependencies: true,

  chainWebpack: (config) => {
    if (useAnalyzer) {
      config
        .plugin("webpack-bundle-analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    }
    config.entry.app = ["babel-polyfill", "./src/main.ts"];
    config.externals = {
      vue: "Vue",
      vuex: "vuex",
      "vue-router": "VueRouter",
    };
  },

  productionSourceMap: false,

  configureWebpack: {
    plugins: [
      ...(isProduction
        ? [
            new CompressionWebpackPlugin({
              algorithm: "gzip",
              test: new RegExp(
                "\\.(" + productionGzipExtensions.join("|") + ")$"
              ),
              threshold: 10240,
              minRatio: 0.8,
              deleteOriginalAssets: false,
            }),
            new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 5 }),
          ]
        : []),
    ],

    optimization: isProduction
      ? {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              parallel: true,
              extractComments: false,
              terserOptions: {
                compress: {
                  drop_console: true,
                  drop_debugger: true,
                },
                format: {
                  comments: false,
                },
              },
            }),
          ],
        }
      : {},
  },
});