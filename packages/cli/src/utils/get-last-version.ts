import { hasCnpm } from './env';
import execa from 'execa';

export const MANAGER = hasCnpm() ? 'cnpm' : 'npm';

export function getLastVersion() {
  const { stdout } = execa.commandSync(`${MANAGER} view @jacksonhuang/cra-cli version`, { encoding: 'utf-8' });
  return stdout;
}
