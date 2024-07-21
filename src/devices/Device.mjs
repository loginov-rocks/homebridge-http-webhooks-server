export class Device {
  constructor({ baseUrl, id, name }) {
    this.baseUrl = baseUrl;
    this.id = id;
    this.name = name;
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
