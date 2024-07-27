import { AbstractAccessory } from './AbstractAccessory.mjs';

export class TemperatureSensor extends AbstractAccessory {
  constructor(...args) {
    super(...args);

    this.temperature = null;
    this.events = [];
  }

  getPluginConfig() {
    return {
      ...super.getPluginConfig(),
      type: 'temperature',
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
    return `/sensors/temperature/${this.id}/_internal`;
  }

  getInternalStateHandler(req, res) {
    res.send({
      id: this.id,
      name: this.name,
      temperature: this.temperature,
      events: this.events,
    });
  }

  async patchInternalStateHandler(req, res) {
    const { temperature } = req.body;

    if (typeof temperature !== 'number') {
      console.error(`[TemperatureSensor] Temperature sensor "${this.id}" temperature cannot be changed to "${temperature}"!`);
      res.status(400).send('Bad Request');
      return;
    }

    if (!temperature && temperature !== 0) {
      return this.getInternalStateHandler(req, res);
    }

    const changedAt = new Date();
    console.log(`[TemperatureSensor] Temperature sensor "${this.id}" temperature was changed to ${temperature}° at ${changedAt}`);

    this.temperature = temperature;
    this.events.push({ changedAt, temperature });
    await this.pluginApi.updateValue(this.id, temperature);

    return this.getInternalStateHandler(req, res);
  }
}
