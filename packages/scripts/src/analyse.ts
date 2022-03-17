import webpack from 'webpack';
import { getConfig, ScriptMode } from './utils/get-config';

export default function () {
  const compiler = webpack(getConfig(ScriptMode.analyse));

  compiler.run((err) => {
    if (err) {
      // 回调中接收错误信息。
      console.error(err);
    } else {
      console.log('🎉 分析结束！');
    }
  });
}
