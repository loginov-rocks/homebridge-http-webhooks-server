export const getRoutes = (devices) => {
  const devicesGroups = Object.keys(devices);

  const routes = [];

  devicesGroups.forEach((devicesGroup) => {
    devices[devicesGroup].forEach((device) => {
      routes.push(...device.getRoutes());
    });
  });

  return routes;
};
