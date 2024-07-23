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
    return [
      {
        handler: this.internalHandler.bind(this),
        method: 'get',
        url: '/_internal',
      },
    ];
  }

  internalHandler(req, res) {
    res.send({
      id: this.id,
      name: this.name,
    });
  }
}
