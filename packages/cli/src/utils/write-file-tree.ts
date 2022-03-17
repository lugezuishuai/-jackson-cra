import fs from 'fs-extra';
import path from 'path';

export function writeFileTree(dir: string, files: Record<string, string>) {
  Object.keys(files).forEach((name) => {
    const pathName = path.join(dir, name);
    fs.ensureDirSync(path.dirname(pathName));
    fs.writeFileSync(pathName, files[name]);
  });
}
