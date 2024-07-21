import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export const readConfig = (configRelativePath) => {
  const configPath = join(dirname(fileURLToPath(import.meta.url)), `../${configRelativePath}`);
  const config = readFileSync(configPath);

  return JSON.parse(config);
};
