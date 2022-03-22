import semver from 'semver';
import inquirer from 'inquirer';
import pkg from '../../package.json';
import execa from 'execa';
import { getLastVersion, MANAGER } from './get-last-version';

export async function beforeCreate() {
  const lastVersion = getLastVersion() || '1.0.0';

  if (semver.gt(lastVersion, pkg.version)) {
    const { update } = await inquirer.prompt([
      {
        type: 'list',
        message: `The latest version is ${lastVersion} do you need to upgrade`,
        name: 'update',
        choices: [
          { name: 'Yes', value: true },
          { name: 'No', value: false },
        ],
      },
    ]);

    update && execa.commandSync(`${MANAGER} update @jacksonhuang/cra-cli -g`);
  }
}
