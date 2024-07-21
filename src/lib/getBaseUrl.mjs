import os from 'os';

export const getBaseUrl = (port) => {
  const networkInterfaces = os.networkInterfaces();
  const { en0 } = networkInterfaces;
  const { address } = en0.find((i) => i.family === 'IPv4');

  return `http://${address}:${port}`;
};
