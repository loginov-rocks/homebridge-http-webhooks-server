import os from 'os';

export const getBaseUrl = (port) => {
  const networkInterfaces = os.networkInterfaces();
  // TODO: Currently does not work in Docker, because requires local network.
  const { en0 } = networkInterfaces;
  const { address } = en0.find((i) => i.family === 'IPv4');

  return `http://${address}:${port}`;
};
