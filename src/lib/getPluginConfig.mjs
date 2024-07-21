export const getPluginConfig = (devices, { platform, webhookPort }) => {
  const devicesGroups = Object.keys(devices);

  const pluginConfig = {
    platform,
    webhook_port: webhookPort,
  };

  devicesGroups.forEach((devicesGroup) => {
    pluginConfig[devicesGroup] = devices[devicesGroup].map((device) => device.getPluginConfig());
  });

  return pluginConfig;
};
