import cors from 'cors';
import express from 'express';

import { CONFIG_RELATIVE_PATH, HOMEBRIDGE_ADDRESS, PLUGIN_CONFIG_PLATFORM, SERVER_ADDRESS } from './constants.mjs';

import { accessoriesMap } from './accessories/index.mjs';

import { accessoriesFactory } from './lib/accessoriesFactory.mjs';
import { getPluginConfig } from './lib/getPluginConfig.mjs';
import { getRoutes } from './lib/getRoutes.mjs';
import { PluginApi } from './lib/PluginApi.mjs';
import { readConfig } from './lib/readConfig.mjs';

const config = readConfig(CONFIG_RELATIVE_PATH);
const homebridgeAddress = HOMEBRIDGE_ADDRESS ? HOMEBRIDGE_ADDRESS : config.homebridge.address;
const serverAddress = SERVER_ADDRESS ? SERVER_ADDRESS : config.server.address;

const baseUrl = `http://${serverAddress}:${config.server.port}`;
const pluginApi = new PluginApi({
  address: homebridgeAddress,
  disableWebhooks: config.plugin.disableWebhooks,
  port: config.plugin.port,
});
const accessories = accessoriesFactory(accessoriesMap, config.accessories, { baseUrl, pluginApi });
const pluginConfig = getPluginConfig(accessories, {
  platform: PLUGIN_CONFIG_PLATFORM,
  port: config.plugin.port,
});
const routes = getRoutes(accessories);

const app = express();

// CORS enabled to allow testing endpoints from the Swagger UI.
app.use(cors());
app.use(express.json());

routes.forEach(({ handler, method, url }) => {
  app[method](url, handler);
});

app.get('/', (req, res) => {
  res.send(pluginConfig);
});

app.listen(config.server.port, () => {
  console.log(`Homebridge HTTP Webhooks Server is listening on port ${config.server.port}`);
});
