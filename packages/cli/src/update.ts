import semver from 'semver';
import pkg from '../package.json';
import { getLastVersion } from './utils/get-last-version';
import { hasCnpm } from './utils/env';
import { execSync } from 'child_process';

const MANAGER = hasCnpm() ? 'cnpm' : 'npm';

export function update() {
  try {
    const lastVersion = getLastVersion();

    if (semver.gt(lastVersion, pkg.version)) {
      console.log('ready to upgrade');
      execSync(`${MANAGER} update @jackson/cra-cli -g`);
    } else {
      console.log(`This is the latest version of ${pkg.version}`);
    }
  } catch (e) {
    console.error(e);
  }
}