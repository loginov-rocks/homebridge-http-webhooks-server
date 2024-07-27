import { AbstractAccessory } from './AbstractAccessory.mjs';

export class Thermostat extends AbstractAccessory {
  static stateIntegerToEnum(stateInteger) {
    // Using a simple array, the state integer serves as an index implementing a simple map.
    const stateEnum = ['off', 'heat', 'cool', 'auto'];

    return stateEnum[stateInteger];
  }

  static stateEnumToInteger(stateEnum) {
    return ['off', 'heat', 'cool', 'auto'].indexOf(stateEnum);
  }

  constructor(...args) {
    super(...args);

    this.currentState = null;
    this.currentTemperature = null;
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

  getTargetStateUrl() {
    return `/thermostats/${this.id}/target-state`;
  }

  getTargetTemperatureUrl() {
    return `/thermostats/${this.id}/target-temperature`;
  }

  getInternalStateUrl() {
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

  getInternalStateHandler(req, res) {
    res.send({
      id: this.id,
      name: this.name,
      currentState: this.currentState,
      currentTemperature: this.currentTemperature,
      targetState: this.targetState,
      targetTemperature: this.targetTemperature,
      events: this.events,
    });
  }

  async patchInternalStateHandler(req, res) {
    const { currentState, currentTemperature } = req.body;

    if (currentState && !['off', 'heat', 'cool'].includes(currentState)) {
      console.error(`[Thermostat] Thermostat "${this.id}" current state cannot be changed to "${currentState}"!`);
      res.status(400).send('Bad Request');
      return;
    }

    if (currentTemperature && typeof currentTemperature !== 'number') {
      console.error(`[Thermostat] Thermostat "${this.id}" current temperature cannot be changed to "${currentTemperature}"!`);
      res.status(400).send('Bad Request');
      return;
    }

    if (!currentState && !currentTemperature && currentTemperature !== 0) {
      return this.getInternalStateHandler(req, res);
    }

    const changedAt = new Date();

    if (currentState) {
      const currentStateInteger = Thermostat.stateEnumToInteger(currentState);
      console.log(`[Thermostat] Thermostat "${this.id}" current state was changed to "${currentState}" at ${changedAt}`);

      this.currentState = currentState;
      this.events.push({ changedAt, currentState });
      await this.pluginApi.updateThermostatCurrentState(this.id, currentStateInteger);
    }

    if (currentTemperature || currentTemperature === 0) {
      console.log(`[Thermostat] Thermostat "${this.id}" current temperature was changed to ${currentTemperature}° at ${changedAt}`);

      this.currentTemperature = currentTemperature;
      this.events.push({ changedAt, currentTemperature });
      await this.pluginApi.updateThermostatCurrentTemperature(this.id, currentTemperature);
    }

    return this.getInternalStateHandler(req, res);
  }
}
