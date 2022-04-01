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
  const tempIndexPath = path.join(templateFilePath, 'index'); // index
  const destIndexPath = `${destFilePath}/index`;
  const tempLessPath = path.join(templateFilePath, 'variable.less'); // variable.less
  const destLessPath = `${destFilePath}/variable.less`;
  const tempPagesPath = path.join(templateFilePath, 'pages/app/index'); // pages/app/index
  const destPagesPath = `${destFilePath}/pages/app/index`;

  if (less) {
    fs.copySync(tempLessPath, destLessPath);
  }

  const suffixs = [['.js'], ['.css']];

  suffixs[0][1] = tsx ? '.tsx' : '.js';
  suffixs[1][1] = less ? '.less' : '.css';

  suffixs.forEach(async (suffix, index) => {
    const tempIndexFile = `${tempIndexPath}${suffix[0]}`;
    const tempPagesFile = `${tempPagesPath}${suffix[0]}`;
    const destIndexFile = `${destIndexPath}${suffix[1]}`;
    const destPagesFile = `${destPagesPath}${suffix[1]}`;

    if (index === 0) {
      if (less) {
        const indexContent = fs.readFileSync(tempIndexFile).toString().replace(/\.css/g, '.less');
        const pagesContent = fs.readFileSync(tempPagesFile).toString().replace(/\.css/g, '.less');

        if (!fs.existsSync(destIndexFile)) {
          fs.mkdirSync(destIndexFile);
        }

        if (!fs.existsSync(destPagesFile)) {
          fs.mkdirSync(destPagesFile);
        }

        fs.writeFileSync(destIndexFile, indexContent);
        fs.writeFileSync(destPagesFile, pagesContent);
      } else {
        fs.copySync(tempIndexFile, destIndexFile);
        fs.copySync(tempPagesFile, destPagesFile);
      }
    } else {
      fs.copySync(tempPagesFile, destPagesFile);
    }
  });
}

export function handleTemplate({ tsx, less }: PluginOptions) {
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
      case 'env': {
        fs.copySync(templateFilePath, path.join(cwd, '.env'));
        break;
      }
      default:
        fs.copySync(templateFilePath, destFilePath);
    }
  });

  // 写入.gitignore文件
  const gitignoreFile = path.join(cwd, '.gitignore');
  if (!fs.existsSync(gitignoreFile)) {
    fs.mkdirSync(gitignoreFile);
  }
  fs.writeFileSync(gitignoreFile, gitignore);
}
