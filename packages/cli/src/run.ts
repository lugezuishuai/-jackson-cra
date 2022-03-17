import { program } from 'commander';
import pkg from '../package.json';
import chalk from 'chalk';
import { create } from './create';
import { update } from './update';

program.version(`jackson-cli ${pkg.version}`, '-v -version').usage('');

program.command('create <app-name>').description('create project').action(create);

program.command('update').description('jackson-cli update').action(update);

program.arguments('<command>').action((cmd) => {
  program.outputHelp();
  console.log();
  console.log(`${chalk.red(`Unknown command ${chalk.yellow(cmd)}.`)}`);
  console.log();
});

program.parse(process.argv);
