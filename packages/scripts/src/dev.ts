import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { getConfig, ScriptMode } from './utils/get-config';

// 设置环境变量
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', (err) => {
  throw err;
});

export default function () {
  const devConfig = getConfig(ScriptMode.dev);
  const { devServer } = devConfig;
  const compiler = webpack(devConfig);
  const server = new WebpackDevServer(compiler, { ...devServer });
  server.listen(devServer.port, 'localhost', (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`🎉 应用程序运行在${devServer.port}端口！`);
    }
  });
}
