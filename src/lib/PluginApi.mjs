export class PluginApi {
  constructor({ address, disableWebhooks, port }) {
    this.address = address;
    this.disableWebhooks = disableWebhooks;
    this.port = port;
  }

  async request(accessoryId, params) {
    const url = new URL(`http://${this.address}:${this.port}`);
    const urlSearchParams = new URLSearchParams(params);
    url.search = urlSearchParams;
    url.searchParams.append('accessoryId', accessoryId);

    if (this.disableWebhooks) {
      console.warn('[PluginApi] Request is not executed, because calls back to the plugin webhooks are disabled!', {
        url: url.href,
      });
      return;
    }

    const response = await fetch(url);

    if (!response.ok) {
      console.error('[PluginApi] Request failed!', {
        url: url.href,
        status: response.status,
        response,
      });
      return;
    }

    const json = await response.json();

    console.log('[PluginApi] Request was successful', {
      url: url.href,
      status: response.status,
      body: json,
    });
  }

  /**
   * @see https://github.com/benzman81/homebridge-http-webhooks?tab=readme-ov-file#trigger-change-for-boolean-accessory
   */
  updateState(accessoryId, newState) {
    console.log(`[PluginApi] Updating accessory ID "${accessoryId}" state to "${newState}"...`);

    return this.request(accessoryId, { state: newState });
  }

  /**
   * @see https://github.com/benzman81/homebridge-http-webhooks?tab=readme-ov-file#update-a-numeric-accessory
   */
  updateValue(accessoryId, newValue) {
    console.log(`[PluginApi] Updating accessory ID "${accessoryId}" value to "${newValue}"...`);

    return this.request(accessoryId, { value: newValue });
  }

  /**
   * @see https://github.com/benzman81/homebridge-http-webhooks?tab=readme-ov-file#thermostat
   */
  updateThermostatCurrentState(thermostatId, currentState) {
    console.log(`[PluginApi] Updating thermostat ID "${thermostatId}" current state to "${currentState}"...`);

    return this.request(thermostatId, { currentstate: currentState });
  }

  updateThermostatCurrentTemperature(thermostatId, currentTemperature) {
    console.log(`[PluginApi] Updating thermostat ID "${thermostatId}" current temperature to "${currentTemperature}"...`);

    return this.request(thermostatId, { currenttemperature: currentTemperature });
  }

  updateThermostatTargetState(thermostatId, targetState) {
    console.log(`[PluginApi] Updating thermostat ID "${thermostatId}" target state to "${targetState}"...`);

    return this.request(thermostatId, { targetstate: targetState });
  }

  updateThermostatTargetTemperature(thermostatId, targetTemperature) {
    console.log(`[PluginApi] Updating thermostat ID "${thermostatId}" target temperature to "${targetTemperature}"...`);

    return this.request(thermostatId, { targettemperature: targetTemperature });
  }
}
