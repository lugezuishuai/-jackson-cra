import config from './webpack.prod';
import { merge } from 'webpack-merge';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const analyseConfig = {
  plugins: [new BundleAnalyzerPlugin()],
};

export default merge(config, analyseConfig);
