import { AbstractAccessory } from './AbstractAccessory.mjs';

export class PushButton extends AbstractAccessory {
  getPluginConfig() {
    return {
      ...super.getPluginConfig(),
      push_url: `${this.baseUrl}${this.getPushUrl()}`,
    };
  }

  getRoutes() {
    return [
      {
        handler: this.pushHandler.bind(this),
        method: 'get',
        url: this.getPushUrl(),
      },
    ];
  }

  getPushUrl() {
    return `/pushbuttons/${this.id}/push`;
  }

  async pushHandler(req, res) {
    console.log(`[PushButton] Push button "${this.id}" was pushed!`);

    await this.pluginApi.updateState(this.id, true);

    res.send('OK');
  }
}
