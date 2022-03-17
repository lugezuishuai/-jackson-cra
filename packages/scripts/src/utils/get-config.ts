import Config from 'webpack-chain';
import { merge } from 'webpack-merge';
import baseConfig from '../config/webpack.common';
import devConfig from '../config/webpack.dev';
import prodConfig from '../config/webpack.prod';
import analyseConfig from '../config/webpack.analyse';

const config = new Config();
const extraConfig = require(`${process.cwd()}/jackson.config.js`);

export enum ScriptMode {
  prod = 'prod',
  dev = 'dev',
  analyse = 'analyse',
}

interface ExtraConfig extends Record<string, any> {
  plugins?: string[];
}

function handleExtraConfig({ plugins }: ExtraConfig, mode: ScriptMode) {
  if (plugins && plugins.length > 0) {
    plugins.forEach((plugin) => {
      const pluginFn = require(plugin);

      if (plugin === '@jackson/cra-plugin-less') {
        pluginFn(config, mode === ScriptMode.dev);
      } else {
        pluginFn(config);
      }
    });
  }
}

export function getConfig(mode: ScriptMode) {
  config.clear();

  const webpackConfig = merge<Record<string, any>>(
    baseConfig,
    mode === ScriptMode.dev ? devConfig : mode === ScriptMode.prod ? prodConfig : analyseConfig
  );
  config.merge(webpackConfig);
  handleExtraConfig(extraConfig, mode);

  return config.toConfig();
}
