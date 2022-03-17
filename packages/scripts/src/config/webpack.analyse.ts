import config from './webpack.prod';
import { merge } from 'webpack-merge';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const smp = new SpeedMeasurePlugin();

const analyseConfig = {
  plugins: [new BundleAnalyzerPlugin()],
};

export default smp.wrap(merge(config, analyseConfig));
