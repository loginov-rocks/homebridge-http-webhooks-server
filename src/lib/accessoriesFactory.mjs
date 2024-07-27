export const accessoriesFactory = (accessoriesMap, accessoriesConfig, { baseUrl, pluginApi }) => {
  const accessories = {};
  const keys = Object.keys(accessoriesConfig);
  const accessoriesIds = [];

  keys.forEach((key) => {
    if (!accessoriesMap.has(key)) {
      console.warn(`[accessoriesFactory] Accessories "${key}" are not supported!`);
      return;
    }

    const accessoriesArray = accessoriesConfig[key].map((accessoryConfig) => {
      const { id, type } = accessoryConfig;

      if (accessoriesIds.includes(id)) {
        console.warn(`[accessoriesFactory] Accessory ID "${id}" must be unique across all accessories!`);
        return null;
      } else {
        accessoriesIds.push(id);
      }

      let ConcreteAccessory;
      if (type) {
        const typesMap = accessoriesMap.get(key);

        if (!typesMap.has(type)) {
          console.warn(`[accessoriesFactory] Accessories "${key}" with type "${type}" are not supported!`);
          return null;
        }

        ConcreteAccessory = typesMap.get(type);
      } else {
        ConcreteAccessory = accessoriesMap.get(key);
      }

      return new ConcreteAccessory({
        baseUrl,
        id,
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
