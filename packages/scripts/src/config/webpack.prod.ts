import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve } from '../utils/resolve';
import dotenv from 'dotenv';
dotenv.config({ path: resolve('.env') });

export default {
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].js',
    path: resolve('dist'),
    publicPath: process.env.SERVICE_URL,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
    }),
  ],
  optimization: {
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      '...',
      new CssMinimizerPlugin(),
    ],
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        commons: {
          name: 'commons',
          priority: -20, // 优先级，当模块符合多个规则时，采取优先级高的规则
          minChunks: 2, // 模块被引用2次及以上的才抽离
          reuseExistingChunk: true, // 已经被分离，被重用而不是生成新的模块
        },
        defaultVendors: {
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: -10,
        },
        base: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|react-use|react-redux|redux|antd|@ant-design|@antv)[\\/]/,
          name: 'base',
          priority: 0,
        },
      },
    },
  },
};
