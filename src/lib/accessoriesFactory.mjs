export const accessoriesFactory = (accessoriesMap, accessoriesConfig, { baseUrl, pluginApi }) => {
  const accessories = {};
  const keys = Object.keys(accessoriesConfig);

  keys.forEach((key) => {
    if (!accessoriesMap.has(key)) {
      console.warn(`[accessoriesFactory] Accessories "${key}" are not supported!`);
      return;
    }

    const ConcreteAccessory = accessoriesMap.get(key);

    accessories[key] = accessoriesConfig[key].map((accessoryConfig) => new ConcreteAccessory({
      baseUrl,
      id: accessoryConfig.id,
      name: accessoryConfig.name,
      pluginApi,
    }));
  });

  return accessories;
};
