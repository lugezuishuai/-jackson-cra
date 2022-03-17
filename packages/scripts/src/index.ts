import { program } from 'commander';
import chalk from 'chalk';
import dev from './dev';
import build from './build';
import analyse from './analyse';

program.command('dev').action(dev);

program.command('build').action(build);

program.command('analyse').action(analyse);

program.arguments('<command>').action((cmd) => {
  program.outputHelp();
  console.log();
  console.log(`${chalk.red(`Unknown command ${chalk.yellow(cmd)}.`)}`);
  console.log();
});

program.parse(process.argv);
