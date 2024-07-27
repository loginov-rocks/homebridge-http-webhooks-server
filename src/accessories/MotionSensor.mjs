import { AbstractAccessory } from './AbstractAccessory.mjs';

export class MotionSensor extends AbstractAccessory {
  constructor(...args) {
    super(...args);

    this.inMotion = null;
    this.events = [];
  }

  getPluginConfig() {
    return {
      ...super.getPluginConfig(),
      type: 'motion',
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
    return `/sensors/motion/${this.id}/_internal`;
  }

  getInternalStateHandler(req, res) {
    res.send({
      id: this.id,
      name: this.name,
      inMotion: this.inMotion,
      events: this.events,
    });
  }

  async patchInternalStateHandler(req, res) {
    const { inMotion } = req.body;

    if (typeof inMotion === 'undefined') {
      return this.getInternalStateHandler(req, res);
    }

    if (inMotion !== false && inMotion !== true) {
      console.error(`[MotionSensor] Motion sensor "${this.id}" in motion state cannot be changed to "${inMotion}"!`);
      res.status(400).send('Bad Request');
      return;
    }

    const changedAt = new Date();
    console.log(`[MotionSensor] Motion sensor "${this.id}" was changed to ${inMotion ? '' : 'not '}in motion at ${changedAt}`);

    this.inMotion = inMotion;
    this.events.push({ changedAt, inMotion });
    await this.pluginApi.updateState(this.id, inMotion);

    return this.getInternalStateHandler(req, res);
  }
}
