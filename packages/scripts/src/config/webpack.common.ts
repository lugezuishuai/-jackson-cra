import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import glob from 'glob';
import { resolve } from '../utils/resolve';

const isEnvProduction = process.env.NODE_ENV === 'production';
const isEnvDevelopment = process.env.NODE_ENV === 'development';
const srcPath = resolve('src');
const miniCssLoader = isEnvProduction ? MiniCssExtractPlugin.loader : 'style-loader';

const cssLoader = {
  loader: 'css-loader',
  options: {
    modules: false, // 禁用css Modules
  },
};

function getEntry() {
  const pages = glob.sync('./src/index.?(js|jsx|ts|tsx)');
  if (pages.length !== 1) {
    return {
      app: './src/index.js',
    };
  }

  return {
    app: pages[0],
  };
}

export default {
  entry: getEntry(),
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': srcPath,
    },
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      defaultWebpack: ['webpack/lib/'],
      config: [__filename],
      tsconfig: [resolve('tsconfig.json')],
    },
  },
  module: {
    noParse: /jquery|chartjs/,
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  corejs: 3,
                  useBuiltIns: 'usage',
                  exclude: ['transform-typeof-symbol'],
                },
              ],
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [
              [
                'babel-plugin-import',
                {
                  libraryName: 'antd',
                  libraryDirectory: 'es',
                  style: true, // 默认使用less，若使用css则改为'css'
                },
              ],
              '@babel/plugin-transform-runtime', // helpers函数统一管理
              '@babel/plugin-syntax-dynamic-import', // 支持import懒加载
              '@babel/plugin-transform-arrow-functions', // 箭头函数处理
              [
                '@babel/plugin-proposal-decorators',
                {
                  legacy: true,
                },
              ], // 装饰器处理
              '@babel/plugin-proposal-class-properties', // 支持class的转译（loose为true时类属性将被编译为赋值表达式而不是 Object.defineProperty）
              '@babel/plugin-proposal-object-rest-spread', // 支持拓展运算符
              isEnvDevelopment && require.resolve('react-refresh/babel'), // 支持React HMR
            ].filter(Boolean),
            cacheDirectory: true,
            cacheCompression: false,
            compact: true,
          },
        },
        include: srcPath,
      },
      {
        test: /\.css$/,
        use: [miniCssLoader, cssLoader],
      },
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        type: 'asset', // url-loader
        generator: {
          filename: 'image/[name].[hash:8][ext]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        type: 'asset/resource', // file-loader
        generator: {
          filename: 'font/[name].[hash:8][ext]',
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset/resource', // file-loader
        generator: {
          filename: 'media/[name].[hash:8][ext]',
        },
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
        issuer: /\.[jt]sx?$/,
      },
      {
        test: /\.(md|txt)(\?.*)?$/,
        include: srcPath,
        type: 'asset/source', // raw-loader
      },
    ],
  },
  plugins: [
    // 如果需要web环境也能访问，必须用这个插件注入
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new HtmlWebpackPlugin({
      title: 'Soul Harbor',
      template: './public/index.html',
      favicon: './public/favicon.ico',
      filename: 'index.html',
      env: process.env.NODE_ENV,
      minify: true,
    }),
  ],
};
