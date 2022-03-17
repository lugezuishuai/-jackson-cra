import validateNpmPackageName from 'validate-npm-package-name';
import chalk from 'chalk';

export function validatePkgName(name: string) {
  const { validForNewPackages, warnings, errors } = validateNpmPackageName(name);

  if (!validForNewPackages) {
    console.log(`Invalid project name: ${chalk.red(name)}`);

    if (warnings) {
      warnings.forEach((warn) => console.log(chalk.red.dim(`warn: ${warn}`)));
    }

    if (errors) {
      errors.forEach((err) => console.log(chalk.red.dim(`err: ${err}`)));
    }

    process.exit(1);
  }
}
