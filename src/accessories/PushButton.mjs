import { AbstractAccessory } from './AbstractAccessory.mjs';

export class PushButton extends AbstractAccessory {
  constructor(...args) {
    super(...args);

    this.events = [];
  }

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
      {
        handler: this.getInternalStateHandler.bind(this),
        method: 'get',
        url: this.getInternalStateUrl(),
      },
    ];
  }

  getPushUrl() {
    return `/pushbuttons/${this.id}/push`;
  }

  getInternalStateUrl() {
    return `/pushbuttons/${this.id}/_internal`;
  }

  async pushHandler(req, res) {
    const pushedAt = new Date();
    console.log(`[PushButton] Push button "${this.id}" was pushed at ${pushedAt}`);

    this.events.push({ pushedAt });
    await this.pluginApi.updateState(this.id, true);

    res.send('OK');
  }

  getInternalStateHandler(req, res) {
    res.send({
      id: this.id,
      name: this.name,
      events: this.events,
    });
  }
}
