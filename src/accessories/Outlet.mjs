import { AbstractAccessory } from './AbstractAccessory.mjs';

export class Outlet extends AbstractAccessory {
  constructor(...args) {
    super(...args);

    this.state = null;
    this.events = [];
  }

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
      {
        handler: this.getInternalStateHandler.bind(this),
        method: 'get',
        url: this.getInternalStateUrl(),
      },
    ];
  }

  getOffUrl() {
    return `/outlets/${this.id}/off`;
  }

  getOnUrl() {
    return `/outlets/${this.id}/on`;
  }

  getInternalStateUrl() {
    return `/outlets/${this.id}/_internal`;
  }

  async offHandler(req, res) {
    const turnedOffAt = new Date();
    console.log(`[Outlet] Outlet "${this.id}" was turned off at ${turnedOffAt}`);

    this.state = false;
    this.events.push({ turnedOffAt });
    await this.pluginApi.updateState(this.id, false);

    res.send('OK');
  }

  async onHandler(req, res) {
    const turnedOnAt = new Date();
    console.log(`[Outlet] Outlet "${this.id}" was turned on at ${turnedOnAt}`);

    this.state = true;
    this.events.push({ turnedOnAt });
    await this.pluginApi.updateState(this.id, true);

    res.send('OK');
  }

  getInternalStateHandler(req, res) {
    res.send({
      id: this.id,
      name: this.name,
      state: this.state,
      events: this.events,
    });
  }
}
