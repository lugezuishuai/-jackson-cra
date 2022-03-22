/**
 * 设置package.json基础选项
 */
export function setPkgBase(options: Record<string, any>) {
  const { name, main, ...rest } = options;

  return {
    name,
    version: '1.0.0',
    description: '',
    main,
    scripts: {},
    keywords: [],
    author: '',
    license: 'ISC',
    browserslist: ['> 1%', 'last 2 versions', 'not ie <= 8', 'iOS 7', 'last 3 iOS versions'],
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
