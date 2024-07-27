export const HOMEBRIDGE_ADDRESS = process.env.HOMEBRIDGE_ADDRESS || null;
export const PLUGIN_DISABLE_WEBHOOKS = process.env.PLUGIN_DISABLE_WEBHOOKS === 'true'
  ? true
  : (process.env.PLUGIN_DISABLE_WEBHOOKS === 'false' ? false : null);
export const PLUGIN_PORT = parseInt(process.env.PLUGIN_PORT, 10) || null;
export const SERVER_ADDRESS = process.env.SERVER_ADDRESS || null;

export const CONFIG_RELATIVE_PATH = '../config.json';
export const PLUGIN_CONFIG_PLATFORM = 'HttpWebHooks';
