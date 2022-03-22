import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import Config from 'webpack-chain';
import path from 'path';

enum ScriptMode {
  prod = 'prod',
  dev = 'dev',
  analyse = 'analyse',
}

export default function (config: Config, mode: ScriptMode) {
  const miniCssLoader = mode === ScriptMode.dev ? 'style-loader' : MiniCssExtractPlugin.loader;
  const _config = config.module.rule('less').test(/\.less$/);
  const use = [miniCssLoader, 'css-loader', 'less-loader', 'style-resources-loader'];
  use.forEach((item) => {
    switch (item) {
      case 'css-loader': {
        _config.use('css-loader').loader(item).options({
          modules: false, // 禁用css Modules
        });
        break;
      }
      case 'less-loader': {
        _config
          .use('less-loader')
          .loader(item)
          .options({
            lessOptions: {
              javascriptEnabled: true,
            },
          });
        break;
      }
      case 'style-resources-loader': {
        _config
          .use('style-resource-loader')
          .loader(item)
          .options({
            patterns: path.join(process.cwd(), './src/variable.less'),
            injector: 'append',
          });
        break;
      }
      default: {
        _config.use('mini-css-loader').loader(item);
      }
    }
  });
}
