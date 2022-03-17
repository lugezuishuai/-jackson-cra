import webpack from 'webpack';
import { getConfig, ScriptMode } from './utils/get-config';
import logSymbols from 'log-symbols';

// 设置环境变量
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', (err) => {
  throw err;
});

export default function () {
  const compiler = webpack(getConfig(ScriptMode.prod));

  compiler.run((err) => {
    if (err) {
      // 回调中接收错误信息。
      console.error(err);
    } else {
      console.log(logSymbols.success, '打包成功！');
    }
  });
}
