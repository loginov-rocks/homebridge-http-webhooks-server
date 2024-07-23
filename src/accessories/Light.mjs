import { AbstractAccessory } from './AbstractAccessory.mjs';

export class Light extends AbstractAccessory {
  constructor(...args) {
    super(...args);

    this.state = null;
    this.brightness = null;
    this.events = [];
  }

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
      {
        handler: this.internalHandler.bind(this),
        method: 'get',
        url: this.getInternalUrl(),
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

  getInternalUrl() {
    return `/lights/${this.id}/_internal`;
  }

  async brightnessHandler(req, res) {
    const brightness = parseInt(req.query.value, 10);

    if (brightness < 0 || brightness > 100) {
      console.error(`[Light] Light "${this.id}" brightness cannot be changed to ${brightness}%!`);
      res.status(400).send('Bad Request');
      return;
    }

    const changedAt = new Date();
    console.log(`[Light] Light "${this.id}" brightness was changed to ${brightness}% at ${changedAt}`);

    this.brightness = brightness;
    this.events.push({ brightness, changedAt });
    await this.pluginApi.updateValue(this.id, brightness);

    res.send('OK');
  }

  async offHandler(req, res) {
    const turnedOffAt = new Date();
    console.log(`[Light] Light "${this.id}" was turned off at ${turnedOffAt}`);

    this.state = false;
    this.events.push({ turnedOffAt });
    await this.pluginApi.updateState(this.id, false);

    res.send('OK');
  }

  async onHandler(req, res) {
    const turnedOnAt = new Date();
    console.log(`[Light] Light "${this.id}" was turned on at ${turnedOnAt}`);

    this.state = true;
    this.events.push({ turnedOnAt });
    await this.pluginApi.updateState(this.id, true);

    res.send('OK');
  }

  internalHandler(req, res) {
    res.send({
      id: this.id,
      name: this.name,
      state: this.state,
      brightness: this.brightness,
      events: this.events,
    });
  }
}
