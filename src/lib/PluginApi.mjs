export class PluginApi {
  constructor({ address, port }) {
    this.address = address;
    this.port = port;
  }

  async updateState(accessoryId, newState) {
    console.log(`[PluginApi] Updating accessory ID "${accessoryId}" state to "${newState}"...`);

    const url = new URL(`http://${this.address}:${this.port}`);
    url.searchParams.append('accessoryId', accessoryId);
    url.searchParams.append('state', newState);

    const response = await fetch(url);

    if (!response.ok) {
      console.error('[PluginApi] Request failed', {
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
}
