import { hasCnpm } from './env';
import { execSync } from 'child_process';

export const MANAGER = hasCnpm() ? 'cnpm' : 'npm';

export function getLastVersion() {
  const lastVersion = execSync(`${MANAGER} view @jackson/cra-cli version`, { encoding: 'utf-8' });
  return lastVersion;
}
