import semver from 'semver';
import pkg from '../package.json';
import { getLastVersion } from './utils/get-last-version';
import { hasCnpm } from './utils/env';
import execa from 'execa';

const MANAGER = hasCnpm() ? 'cnpm' : 'npm';

export function update() {
  try {
    const lastVersion = getLastVersion();

    if (semver.gt(lastVersion, pkg.version)) {
      console.log('ready to upgrade');
      execa.commandSync(`${MANAGER} update @jacksonhuang/cra-cli -g`);
    } else {
      console.log(`This is the latest version of ${pkg.version}`);
    }
  } catch (e) {
    console.error(e);
  }
}
