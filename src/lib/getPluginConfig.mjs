export const getPluginConfig = (accessories, { platform, port }) => {
  const pluginConfig = {
    platform,
    webhook_port: port.toString(),
  };
  const keys = Object.keys(accessories);

  keys.forEach((key) => {
    pluginConfig[key] = accessories[key].map((accessory) => accessory.getPluginConfig());
  });

  return pluginConfig;
};
