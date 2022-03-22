export interface PluginOptions {
  tsx: boolean;
  less: boolean;
}

export function getPluginOptions(_plugins: string[]) {
  const options: PluginOptions = {
    tsx: false,
    less: false,
  };
  const plugins: string[] = [];

  _plugins.forEach((item) => {
    const [opt, ...rest] = item;

    options[opt] = true;
    plugins.push(...rest);
  });

  return {
    options,
    plugins,
  };
}
