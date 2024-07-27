import { AbstractAccessory } from './AbstractAccessory.mjs';

export class ContactSensor extends AbstractAccessory {
  constructor(...args) {
    super(...args);

    this.inContact = null;
    this.events = [];
  }

  getPluginConfig() {
    return {
      ...super.getPluginConfig(),
      type: 'contact',
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
    return `/sensors/contact/${this.id}/_internal`;
  }

  getInternalStateHandler(req, res) {
    res.send({
      id: this.id,
      name: this.name,
      inContact: this.inContact,
      events: this.events,
    });
  }

  async patchInternalStateHandler(req, res) {
    const { inContact } = req.body;

    if (typeof inContact === 'undefined') {
      return this.getInternalStateHandler(req, res);
    }

    if (inContact !== false && inContact !== true) {
      console.error(`[ContactSensor] Contact sensor "${this.id}" in contact state cannot be changed to "${inContact}"!`);
      res.status(400).send('Bad Request');
      return;
    }

    const changedAt = new Date();
    console.log(`[ContactSensor] Contact sensor "${this.id}" was changed to ${inContact ? '' : 'not '}in contact at ${changedAt}`);

    this.inContact = inContact;
    this.events.push({ changedAt, inContact });
    await this.pluginApi.updateState(this.id, inContact);

    return this.getInternalStateHandler(req, res);
  }
}
