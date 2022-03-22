import execa from 'execa';

const _env = {
  _hasYarn: null,
  _hasCnpm: null,
};

function checkEnv(name: string) {
  const envKey = `_has${name[0].toUpperCase()}${name.slice(1)}`;

  if (_env[envKey] !== null) {
    return _env[envKey];
  }

  try {
    execa.commandSync(`${name} --version`, { stdio: 'ignore' });

    return (_env[envKey] = true);
  } catch (e) {
    return (_env[envKey] = false);
  }
}

export const hasYarn = checkEnv.bind(this, 'yarn');
export const hasCnpm = checkEnv.bind(this, 'cnpm');

