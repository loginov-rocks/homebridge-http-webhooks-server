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

  updateState(accessoryId, newState) {
    console.log(`[PluginApi] Updating accessory ID "${accessoryId}" state to "${newState}"...`);

    return this.request(accessoryId, { state: newState });
  }

  updateValue(accessoryId, newValue) {
    console.log(`[PluginApi] Updating accessory ID "${accessoryId}" value to "${newValue}"...`);

    return this.request(accessoryId, { value: newValue });
  }
}
