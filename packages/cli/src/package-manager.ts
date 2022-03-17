/**
 * Download Management
 */
import path from 'path';
import { execSync } from 'child_process';
import { hasYarn, hasCnpm } from './utils/env';

const PM_CONFIG = {
  npm: {
    install: ['install', '--loglevel', 'error'],
    remove: ['uninstall', '--loglevel', 'error'],
  },
  cnpm: {
    install: ['install', '--loglevel', 'error'],
    remove: ['uninstall', '--loglevel', 'error'],
  },
  yarn: {
    install: [],
    remove: ['remove'],
  },
};

export class PackageManager {
  pkgName: string;
  bin: string;
  constructor(pkgName: string) {
    this.pkgName = pkgName;

    if (hasYarn()) {
      this.bin = 'yarn';
    } else if (hasCnpm()) {
      this.bin = 'cnpm';
    } else {
      this.bin = 'npm';
    }
  }

  cdPath() {
    const aimPath = path.join(process.cwd(), this.pkgName);

    process.chdir(aimPath);
  }

  runCommand(command: string, args: string[] = []) {
    const _commands = [this.bin, ...PM_CONFIG[this.bin][command], ...args];
    execSync(_commands.join(' '), { stdio: [0, 1, 2] });
  }

  install() {
    try {
      this.runCommand('install', ['--offline']); // 先去拉取缓存，如果没有再去服务器拉取
    } catch (e) {
      this.runCommand('install');
    }
  }

  git() {
    try {
      execSync('git init');
      return true;
    } catch (e) {
      return false;
    }
  }
}
