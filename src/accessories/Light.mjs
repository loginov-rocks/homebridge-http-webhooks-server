import { AbstractAccessory } from './AbstractAccessory.mjs';

export class Light extends AbstractAccessory {
  getPluginConfig() {
    return {
      ...super.getPluginConfig(),
      brightness_url: `${this.baseUrl}${this.getBrightnessUrl()}?value=%brightnessPlaceholder`,
      off_url: `${this.baseUrl}${this.getOffUrl()}`,
      on_url: `${this.baseUrl}${this.getOnUrl()}`,
    };
  }

  getRoutes() {
    return [
      {
        handler: this.brightnessHandler.bind(this),
        method: 'get',
        url: this.getBrightnessUrl(),
      },
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

  getBrightnessUrl() {
    return `/lights/${this.id}/brightness`;
  }

  getOffUrl() {
    return `/lights/${this.id}/off`;
  }

  getOnUrl() {
    return `/lights/${this.id}/on`;
  }

  async brightnessHandler(req, res) {
    const brightness = parseInt(req.query.value, 10);
    console.log(`[Light] Light "${this.id}" brightness was changed to ${brightness}%`);

    await this.pluginApi.updateValue(this.id, brightness);

    res.send('OK');
  }

  async offHandler(req, res) {
    console.log(`[Light] Light "${this.id}" was turned off!`);

    await this.pluginApi.updateState(this.id, false);

    res.send('OK');
  }

  async onHandler(req, res) {
    console.log(`[Light] Light "${this.id}" was turned on!`);

    await this.pluginApi.updateState(this.id, true);

    res.send('OK');
  }
}
