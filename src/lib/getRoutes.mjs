export const getRoutes = (accessories) => {
  const routes = [];
  const keys = Object.keys(accessories);

  keys.forEach((key) => {
    accessories[key].forEach((accessory) => {
      routes.push(...accessory.getRoutes());
    });
  });

  return routes;
};
