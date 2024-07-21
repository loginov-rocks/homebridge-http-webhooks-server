export const devicesFactory = (devicesMap, baseUrl, config) => {
  const devicesGroups = Object.keys(config);

  const devices = {};

  devicesGroups.forEach((devicesGroup) => {
    if (!devicesMap.has(devicesGroup)) {
      console.warn(`Device group "${devicesGroup}" is not supported!`);
      return;
    }

    const Device = devicesMap.get(devicesGroup);

    devices[devicesGroup] = config[devicesGroup].map((deviceConfig) => new Device({
      baseUrl,
      id: deviceConfig.id,
      name: deviceConfig.name,
    }));
  });

  return devices;
};
