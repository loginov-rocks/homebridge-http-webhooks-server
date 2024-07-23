import { AbstractAccessory } from './AbstractAccessory.mjs';

export class Thermostat extends AbstractAccessory {
  static stateIntegerToEnum(stateInteger) {
    // Using a simple array, the state integer serves as an index implementing a simple map.
    const stateEnum = ['off', 'heat', 'cool', 'auto'];

    return stateEnum[stateInteger];
  }

  constructor(...args) {
    super(...args);

    this.targetState = null;
    this.targetTemperature = null;
    this.events = [];
  }

  getPluginConfig() {
    return {
      ...super.getPluginConfig(),
      set_target_heating_cooling_state_url: `${this.baseUrl}${this.getTargetStateUrl()}?value=%b`,
      set_target_temperature_url: `${this.baseUrl}${this.getTargetTemperatureUrl()}?value=%f`,
    };
  }

  getRoutes() {
    return [
      {
        handler: this.targetStateHandler.bind(this),
        method: 'get',
        url: this.getTargetStateUrl(),
      },
      {
        handler: this.targetTemperatureHandler.bind(this),
        method: 'get',
        url: this.getTargetTemperatureUrl(),
      },
      {
        handler: this.internalHandler.bind(this),
        method: 'get',
        url: this.getInternalUrl(),
      },
    ];
  }

  getTargetStateUrl() {
    return `/thermostats/${this.id}/target-state`;
  }

  getTargetTemperatureUrl() {
    return `/thermostats/${this.id}/target-temperature`;
  }

  getInternalUrl() {
    return `/thermostats/${this.id}/_internal`;
  }

  async targetStateHandler(req, res) {
    const targetStateInteger = parseInt(req.query.value, 10);

    if (targetStateInteger < 0 || targetStateInteger > 3) {
      console.error(`[Thermostat] Thermostat "${this.id}" target state cannot be changed to "${targetStateInteger}"!`);
      res.status(400).send('Bad Request');
      return;
    }

    const targetState = Thermostat.stateIntegerToEnum(targetStateInteger);
    const changedAt = new Date();
    console.log(`[Thermostat] Thermostat "${this.id}" target state was changed to "${targetState}" at ${changedAt}`);

    this.targetState = targetState;
    this.events.push({ changedAt, targetState });
    await this.pluginApi.updateThermostatTargetState(this.id, targetStateInteger);

    res.send('OK');
  }

  async targetTemperatureHandler(req, res) {
    const targetTemperature = parseFloat(req.query.value);
    const changedAt = new Date();
    console.log(`[Thermostat] Thermostat "${this.id}" target temperature was changed to ${targetTemperature}° at ${changedAt}`);

    this.targetTemperature = targetTemperature;
    this.events.push({ changedAt, targetTemperature });
    await this.pluginApi.updateThermostatTargetTemperature(this.id, targetTemperature);

    res.send('OK');
  }

  internalHandler(req, res) {
    res.send({
      id: this.id,
      name: this.name,
      targetState: this.targetState,
      targetTemperature: this.targetTemperature,
      events: this.events,
    });
  }
}
