import { AbstractAccessory } from './AbstractAccessory.mjs';

export class HumiditySensor extends AbstractAccessory {
  constructor(...args) {
    super(...args);

    this.humidity = null;
    this.events = [];
  }

  getPluginConfig() {
    return {
      ...super.getPluginConfig(),
      type: 'humidity',
    };
  }

  getRoutes() {
    return [
      {
        handler: this.getInternalStateHandler.bind(this),
        method: 'get',
        url: this.getInternalStateUrl(),
      },
      {
        handler: this.patchInternalStateHandler.bind(this),
        method: 'patch',
        url: this.getInternalStateUrl(),
      },
    ];
  }

  getInternalStateUrl() {
    return `/sensors/humidity/${this.id}/_internal`;
  }

  getInternalStateHandler(req, res) {
    res.send({
      id: this.id,
      name: this.name,
      humidity: this.humidity,
      events: this.events,
    });
  }

  async patchInternalStateHandler(req, res) {
    const { humidity } = req.body;

    if (typeof humidity === 'undefined') {
      return this.getInternalStateHandler(req, res);
    }

    if (typeof humidity !== 'number') {
      console.error(`[HumiditySensor] Humidity sensor "${this.id}" humidity cannot be changed to "${humidity}"!`);
      res.status(400).send('Bad Request');
      return;
    }

    const changedAt = new Date();
    console.log(`[HumiditySensor] Humidity sensor "${this.id}" humidity was changed to ${humidity}% at ${changedAt}`);

    this.humidity = humidity;
    this.events.push({ changedAt, humidity });
    await this.pluginApi.updateValue(this.id, humidity);

    return this.getInternalStateHandler(req, res);
  }
}
