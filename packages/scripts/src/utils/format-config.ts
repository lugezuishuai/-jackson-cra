import Config from 'webpack-chain';
import { Configuration } from 'webpack';
import { ScriptMode } from './get-config';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

const RE_SUFFIX = ['js', 'css', 'less', 'png', 'woff', 'mp4', 'svg', 'txt'];

// 取每一个rule的第一个匹配项作为该rule的命名
function reSuffix(test: RegExp) {
  const strReg = test.toString();

  for (let i = 0; i < RE_SUFFIX.length; i++) {
    if (strReg.includes(RE_SUFFIX[i])) {
      return RE_SUFFIX[i];
    }
  }

  throw new Error(`not exist module.rules.test: ${test}`);
}

export function formatConfig(base: Configuration, config: Config, mode: ScriptMode) {
  Object.keys(base).forEach((key) => {
    const val: Record<string, any> = {};
    val[key] = base[key];

    switch (key) {
      case 'plugins': {
        break; // 插件单独处理
      }
      case 'module': {
        const modules = base[key];
        modules.rules.forEach((rule: any) => {
          const { test } = rule;
          const suffix = reSuffix(test);
          let _config = config.module.rule(suffix).test(test);
          const { use, include, exclude, type, parser } = rule;

          if (include) {
            if (Array.isArray(include)) {
              _config = include.reduce((accu, curr, index) => {
                if (index === include.length - 1) {
                  return accu.add(curr).end();
                } else if (index === 0) {
                  return accu.include.add(curr);
                } else {
                  return accu.add(curr);
                }
              }, _config);
            } else {
              _config = _config.include.add(include).end();
            }
          }

          if (exclude) {
            if (Array.isArray(exclude)) {
              _config = exclude.reduce((accu, curr, index) => {
                if (index === exclude.length - 1) {
                  return accu.add(curr).end();
                } else if (index === 0) {
                  return accu.exclude.add(curr);
                } else {
                  return accu.add(curr);
                }
              }, _config);
            } else {
              _config = _config.exclude.add(exclude).end();
            }
          }

          if (use) {
            if (Array.isArray(use)) {
              use.forEach((item) => {
                if (typeof item === 'string') {
                  _config.use(item).loader(item);
                } else {
                  const { loader, options } = item;
                  _config.use(loader).loader(loader).options(options);
                }
              });
            } else {
              throw new Error('module.rules.use must be an array!');
            }
          }

          if (type) {
            _config.type(type);
          }

          if (parser) {
            _config.parser(parser);
          }
        });
        break;
      }
      default: {
        config.merge(val);
      }
    }
  });

  if (mode !== ScriptMode.dev) {
    // webpack-chain merge对optimization的解析有点问题
    config.optimization
      .minimize(true)
      .minimizer('css-minimizer')
      .use(CssMinimizerPlugin)
      .end()
      .minimizer('terser-plugin')
      .use(TerserPlugin)
      .end()
      .runtimeChunk(true)
      .splitChunks({
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
      });
  }
}
