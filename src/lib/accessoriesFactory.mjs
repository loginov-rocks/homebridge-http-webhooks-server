export const accessoriesFactory = (accessoriesMap, accessoriesConfig, { baseUrl, pluginApi }) => {
  const accessories = {};
  const keys = Object.keys(accessoriesConfig);

  keys.forEach((key) => {
    if (!accessoriesMap.has(key)) {
      console.warn(`[accessoriesFactory] Accessories "${key}" are not supported!`);
      return;
    }

    const accessoriesArray = accessoriesConfig[key].map((accessoryConfig) => {
      let ConcreteAccessory;
      if (accessoryConfig.type) {
        const typeMap = accessoriesMap.get(key);

        if (!typeMap.has(accessoryConfig.type)) {
          console.warn(`[accessoriesFactory] Accessories "${key}" with type "${accessoryConfig.type}" are not supported!`);
          return null;
        }

        ConcreteAccessory = typeMap.get(accessoryConfig.type);
      } else {
        ConcreteAccessory = accessoriesMap.get(key);
      }

      return new ConcreteAccessory({
        baseUrl,
        id: accessoryConfig.id,
        name: accessoryConfig.name,
        pluginApi,
      });
    }).filter((accessory) => accessory !== null);

    if (accessoriesArray.length > 0) {
      accessories[key] = accessoriesArray;
    }
  });

  return accessories;
};
