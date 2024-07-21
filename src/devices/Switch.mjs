import { Device } from './Device.mjs';

export class Switch extends Device {
  getPluginConfig() {
    return {
      ...super.getPluginConfig(),
      on_url: `${this.baseUrl}${this.getOnUrl()}`,
      off_url: `${this.baseUrl}${this.getOffUrl()}`,
    };
  }

  getRoutes() {
    return [
      {
        method: 'get',
        url: this.getOnUrl(),
        handler: this.onHandler.bind(this),
      },
      {
        method: 'get',
        url: this.getOffUrl(),
        handler: this.offHandler.bind(this),
      }
    ];
  }

  getOnUrl() {
    return `/switches/${this.id}/on`;
  }

  onHandler(req, res) {
    console.log(`Switch "${this.id}" was turned on!`);

    res.send('OK');
  }

  getOffUrl() {
    return `/switches/${this.id}/off`;
  }

  offHandler(req, res) {
    console.log(`Switch "${this.id}" was turned off!`);

    res.send('OK');
  }
}
