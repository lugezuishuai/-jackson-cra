import Config from 'webpack-chain';
import { merge } from 'webpack-merge';
import baseConfig from '../config/webpack.common';
import devConfig from '../config/webpack.dev';
import prodConfig from '../config/webpack.prod';
import analyseConfig from '../config/webpack.analyse';
import { Configuration } from 'webpack';
import { formatConfig } from './format-config';

type ConfigType = Configuration | ((config: Config, env: ScriptMode) => void); // 配置类型

const config = new Config();
const extraConfig = require(`${process.cwd()}/jackson.config.js`);
const pkg = require(`${process.cwd()}/package.json`);

export enum ScriptMode {
  prod = 'prod',
  dev = 'dev',
  analyse = 'analyse',
}

function executePlugin(plugin: ConfigType, mode: ScriptMode) {
  if (typeof plugin === 'function') {
    plugin(config, mode);
  } else {
    config.merge(plugin);
  }
}

function handleExtraConfig(_config: ConfigType, mode: ScriptMode) {
  const plugins: ConfigType[] = [];
  if (pkg.devDependencies['@jacksonhuang/cra-plugin-less']) {
    plugins.push(require('@jacksonhuang/cra-plugin-less').default);
  }

  if (pkg.devDependencies['@jacksonhuang/cra-plugin-typescript']) {
    plugins.push(require('@jacksonhuang/cra-plugin-typescript').default);
  }

  plugins.forEach((plugin) => executePlugin(plugin, mode));

  if (typeof _config === 'function') {
    _config(config, mode);
  } else {
    config.merge(_config);
  }
}

export function getConfig(mode: ScriptMode) {
  config.clear();

  const webpackConfig = merge(
    baseConfig,
    mode === ScriptMode.dev ? devConfig : mode === ScriptMode.prod ? prodConfig : analyseConfig
  );
  formatConfig(webpackConfig, config, mode);
  handleExtraConfig(extraConfig, mode);

  return merge(config.toConfig(), {
    plugins: webpackConfig.plugins,
  });
}
