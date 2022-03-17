/**
 * 设置package.json基础选项
 */
export function setPkgBase(options: Record<string, any>) {
  const { name, ...rest } = options;

  return {
    name,
    version: '1.0.0',
    private: true,
    description: '',
    main: 'index.js',
    scripts: {},
    keywords: [],
    author: '',
    license: 'ISC',
    ...rest,
  };
}

/**
 * 设置package.json运行脚本
 */
export function setPkgScripts(pkg: Record<string, any>) {
  pkg.scripts = {
    dev: 'jackson-scripts dev',
    build: 'jackson-scripts build',
    analyse: 'jackson-scripts analyse',
  };
}
