import { AbstractAccessory } from './AbstractAccessory.mjs';

export class Switch extends AbstractAccessory {
  getPluginConfig() {
    return {
      ...super.getPluginConfig(),
      off_url: `${this.baseUrl}${this.getOffUrl()}`,
      on_url: `${this.baseUrl}${this.getOnUrl()}`,
    };
  }

  getRoutes() {
    return [
      {
        handler: this.offHandler.bind(this),
        method: 'get',
        url: this.getOffUrl(),
      },
      {
        handler: this.onHandler.bind(this),
        method: 'get',
        url: this.getOnUrl(),
      },
    ];
  }

  getOffUrl() {
    return `/switches/${this.id}/off`;
  }

  getOnUrl() {
    return `/switches/${this.id}/on`;
  }

  async offHandler(req, res) {
    console.log(`[Switch] Switch "${this.id}" was turned off!`);

    await this.pluginApi.updateState(this.id, false);

    res.send('OK');
  }

  async onHandler(req, res) {
    console.log(`[Switch] Switch "${this.id}" was turned on!`);

    await this.pluginApi.updateState(this.id, true);

    res.send('OK');
  }
}
