import proxy from '../utils/proxy';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { resolve } from '../utils/resolve';
import dotenv from 'dotenv';
dotenv.config({ path: resolve('.env') });

export default {
  mode: 'development',
  output: {
    filename: '[name].[hash:8].js',
    chunkFilename: '[name].[hash:8].js',
    path: resolve('dist'),
    publicPath: '/',
  },
  plugins: [new ReactRefreshWebpackPlugin()],
  devtool: 'source-map',
  devServer: {
    client: {
      logging: 'error',
      overlay: false,
      webSocketTransport: 'ws',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
    historyApiFallback: true,
    open: true,
    port: 5000,
    proxy,
    watchFiles: {
      options: {
        ignored: process.env.WATCH_FILES_REG ? !new RegExp(process.env.WATCH_FILES_REG) : undefined,
      },
    },
    webSocketServer: 'ws',
  },
};
