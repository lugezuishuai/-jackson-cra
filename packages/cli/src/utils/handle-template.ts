/**
 * 处理模板文件
 */
import fs from 'fs-extra';
import path from 'path';
import { PluginOptions } from './get-plugin-options';

const gitignore = `
.DS_Store
node_modules/
.npm
.env
*.log*
*.pid
*.pid.*
*.report
.sonarlint
.idea/
.eslintcache
.vscode/**/*
!.vscode/settings.json
!.vscode/extensions.json
dist/
coverage/
lib-cov
`;

// src目录下复制文件
function copyFiles(destFilePath: string, templateFilePath: string, { tsx, less }: { tsx: boolean; less: boolean }) {
  const tempSrc = path.join(templateFilePath, 'pages/index');
  const destSrc = `${destFilePath}/pages/index`;
  const tempLessPath = path.join(templateFilePath, 'variable.less');
  const destLessPath = `${destFilePath}/variable.less`;

  if (less) {
    fs.copySync(tempLessPath, destLessPath);
  }

  const suffixs = [['.js'], ['.css']];

  suffixs[0][1] = tsx ? '.tsx' : '.js';
  suffixs[1][1] = less ? '.less' : '.css';

  suffixs.forEach((suffix, index) => {
    if (index === 0 && less) {
      const content = fs.readFileSync(`${tempSrc}${suffix[0]}`).toString().replace(/\.css/g, 'less');

      fs.writeFileSync(`${destSrc}${suffix[1]}`, content);
      return;
    }

    fs.copySync(`${tempSrc}${suffix[0]}`, `${destSrc}${suffix[1]}`);
  });
}

export function handleTemplate({ tsx, less, config = {} }: PluginOptions) {
  const cwd = process.cwd(); // 当前项目的路径
  const templatePath = path.join(
    path.dirname(require.resolve('@jacksonhuang/cra-template/package.json', { paths: [cwd] })),
    './template'
  ); // 模板文件的目录
  const files = fs.readdirSync(templatePath);

  files.forEach((file) => {
    const templateFilePath = path.join(templatePath, file); // 模板具体文件路径
    const destFilePath = `${cwd}/${file}`; // 项目文件路径

    switch (file) {
      case 'src': {
        fs.ensureDirSync(destFilePath);
        fs.emptyDirSync(`${destFilePath}/pages`);

        copyFiles(destFilePath, templateFilePath, { tsx, less });
        break;
      }
      case 'tsconfig.json': {
        if (tsx) {
          fs.copySync(templateFilePath, destFilePath);
        }

        break;
      }
      case '.eslintrc.js': {
        if (!tsx) {
          fs.copySync(templateFilePath, destFilePath);
        }

        break;
      }
      case '.eslintrc-ts.js': {
        if (tsx) {
          fs.copySync(templateFilePath, path.join(cwd, '.eslintrc.js'));
        }

        break;
      }
      case 'jackson.config.js': {
        const content = `module.exports = ${JSON.stringify(config, null, 2)}`;
        fs.writeFileSync(destFilePath, content);
        break;
      }
      default:
        fs.copySync(templateFilePath, destFilePath);
    }
  });

  // 写入.gitignore文件
  fs.writeFileSync(path.join(cwd, '.gitignore'), gitignore);
}
