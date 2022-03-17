import path from 'path';

export function resolve(...params: string[]) {
  return path.resolve(process.cwd(), ...params);
}
