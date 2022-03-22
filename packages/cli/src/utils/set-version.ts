import execa from 'execa';
import { hasCnpm } from './env';

export function setVersion(list: string[], obj: Record<string, any>, key: string): Promise<any>[] {
  const promiseList: Promise<any>[] = [];
  const manager = hasCnpm() ? 'cnpm' : 'npm';

  list.forEach((item) => {
    const promise = new Promise((resolve, reject) => {
      execa
        .command(`${manager} view ${item} version`)
        .then(({ stderr, stdout }) => {
          if (stderr) {
            reject(stderr);
          } else {
            obj[key][item] = `^${stdout}`;
            resolve(0);
          }
        })
        .catch((e) => {
          reject(e);
        });
    });

    promiseList.push(promise);
  });

  return promiseList;
}
