import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import inquirer from 'inquirer';
import { validatePkgName } from './utils/validate-pkg-name';
import { beforeCreate } from './utils/before-create';
import { clear } from './utils/clear';
import { getPluginOptions } from './utils/get-plugin-options';
import { PackageManager } from './package-manager';
import { setPkgBase, setPkgScripts } from './utils/set-pkg';
import { setVersion } from './utils/set-version';
import { writeFileTree } from './utils/write-file-tree';
import { handleTemplate } from './utils/handle-template';
import { execSync } from 'child_process';

interface Plugin {
  name: string;
  value: string[];
}

const loading = ora();
const PLUGIN_ARR: Plugin[] = [
  {
    name: 'Typescript',
    value: ['tsx', '@jacksonhuang/cra-plugin-typescript'],
  },
  {
    name: 'Less',
    value: ['less', '@jacksonhuang/cra-plugin-less'],
  },
];

export async function create(pkgName: string) {
  try {
    validatePkgName(pkgName);

    const cwd = process.cwd();
    const targetDir = path.join(cwd, pkgName);

    await beforeCreate();

    if (fs.existsSync(targetDir)) {
      clear();

      const { overwrite } = await inquirer.prompt([
        {
          type: 'list',
          message: 'Target directory already exists. Can I overwrite it',
          name: 'overwrite',
          choices: [
            {
              name: 'Yes',
              value: true,
            },
            {
              name: 'No',
              value: false,
            },
          ],
        },
      ]);

      overwrite || process.exit(1);
      await fs.remove(targetDir);
    }

    clear();

    const { plugins: morePlugins } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'plugins',
        message: 'Do you need these plugins',
        choices: PLUGIN_ARR,
      },
    ]);

    loading.start('Initialize project...');

    fs.mkdirSync(targetDir);

    const { options, plugins: devDependencies } = getPluginOptions(morePlugins);
    const pm = new PackageManager(pkgName);
    const pkg = setPkgBase({
      name: pkgName,
      dependencies: {},
      devDependencies: {},
    });
    const dependencies = ['react', 'react-dom'];

    options.config = {
      plugins: [...devDependencies],
    };

    devDependencies.push('@jacksonhuang/cra-scripts', '@jacksonhuang/cra-template');

    const promises = [
      ...setVersion(dependencies, pkg, 'dependencies'),
      ...setVersion(devDependencies, pkg, 'devDependencies'),
    ];

    await Promise.all(promises);

    setPkgScripts(pkg);
    pm.cdPath();

    // 写入package.json文件
    writeFileTree(targetDir, {
      'package.json': JSON.stringify(pkg, null, 2),
    });

    loading.succeed('🚀 Initialization successful!');

    // 安装依赖
    pm.install();

    // 初始化git
    execSync('git init');

    // 拷贝模板
    handleTemplate(options);

    // 删除@jacksonhuang/cra-template依赖
    if (pm.bin === 'yarn') {
      execSync('yarn remove @jacksonhuang/cra-template');
    } else {
      execSync(`${pm.bin} uninstall @jacksonhuang/cra-template`);
    }

    loading.succeed('🎉 Successfully created project!');
    console.log();
    console.log(`$ cd ${pkgName}`);
    console.log('$ npm run dev');
    console.log();
  } catch (e) {
    console.error(e);
  }
}
