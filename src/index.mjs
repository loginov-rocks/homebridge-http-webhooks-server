import express from 'express';

import { CONFIG_RELATIVE_PATH, PLUGIN_CONFIG_PLATFORM, PLUGIN_CONFIG_WEBHOOK_PORT, PORT } from './constants.mjs';

import { devicesMap } from './devices/index.mjs';

import { devicesFactory } from './lib/devicesFactory.mjs';
import { getBaseUrl } from './lib/getBaseUrl.mjs';
import { getPluginConfig } from './lib/getPluginConfig.mjs';
import { getRoutes } from './lib/getRoutes.mjs';
import { readConfig } from './lib/readConfig.mjs';

const baseUrl = getBaseUrl(PORT);
const config = readConfig(CONFIG_RELATIVE_PATH);
const devices = devicesFactory(devicesMap, baseUrl, config);
const pluginConfig = getPluginConfig(devices, {
  platform: PLUGIN_CONFIG_PLATFORM,
  webhookPort: PLUGIN_CONFIG_WEBHOOK_PORT,
});
const routes = getRoutes(devices);

const app = express();

routes.forEach(({ method, url, handler }) => {
  app[method](url, handler);
});

app.get('/', (req, res) => {
  res.send(pluginConfig);
});

app.listen(PORT, () => {
  console.log(`Homebridge HTTP Webhooks Server is listening on port ${PORT}`);
});
