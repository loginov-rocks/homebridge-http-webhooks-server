export class AbstractAccessory {
  constructor({ baseUrl, id, name, pluginApi }) {
    this.baseUrl = baseUrl;
    this.id = id;
    this.name = name;
    this.pluginApi = pluginApi;
  }

  getPluginConfig() {
    return {
      id: this.id,
      name: this.name,
    };
  }

  getRoutes() {
    return [];
  }
}
