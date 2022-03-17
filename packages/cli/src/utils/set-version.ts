import { exec } from 'child_process';
import { hasCnpm } from './env';

export function setVersion(list: string[], obj: Record<string, any>, key: string): Promise<any>[] {
  const promiseList: Promise<any>[] = [];
  const manager = hasCnpm() ? 'cnpm' : 'npm';

  list.forEach((item) => {
    const promise = new Promise((resolve, reject) => {
      exec(`${manager} view ${item} version`, (err, stdout) => {
        if (err) {
          reject(err);
        } else {
          obj[key][item] = `^${stdout.slice(0, stdout.length - 1)}`;
          resolve(0);
        }
      });
    });

    promiseList.push(promise);
  });

  return promiseList;
}
