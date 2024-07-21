import express from 'express';

import { CONFIG_RELATIVE_PATH, PLUGIN_CONFIG_PLATFORM } from './constants.mjs';

import { accessoriesMap } from './accessories/index.mjs';

import { accessoriesFactory } from './lib/accessoriesFactory.mjs';
import { getBaseUrl } from './lib/getBaseUrl.mjs';
import { getPluginConfig } from './lib/getPluginConfig.mjs';
import { getRoutes } from './lib/getRoutes.mjs';
import { PluginApi } from './lib/PluginApi.mjs';
import { readConfig } from './lib/readConfig.mjs';

const config = readConfig(CONFIG_RELATIVE_PATH);

const baseUrl = getBaseUrl(config.server.port);
const pluginApi = new PluginApi({
  address: config.homebridge.address,
  port: config.plugin.port,
});
const accessories = accessoriesFactory(accessoriesMap, config.accessories, { baseUrl, pluginApi });
const pluginConfig = getPluginConfig(accessories, {
  platform: PLUGIN_CONFIG_PLATFORM,
  port: config.plugin.port,
});
const routes = getRoutes(accessories);

const app = express();

routes.forEach(({ handler, method, url }) => {
  app[method](url, handler);
});

app.get('/', (req, res) => {
  res.send(pluginConfig);
});

app.listen(config.server.port, () => {
  console.log(`Homebridge HTTP Webhooks Server is listening on port ${config.server.port}`);
});
