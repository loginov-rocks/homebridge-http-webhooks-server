import cors from 'cors';
import express from 'express';

import {
  CONFIG_RELATIVE_PATH, HOMEBRIDGE_ADDRESS, PLUGIN_CONFIG_PLATFORM, PLUGIN_DISABLE_WEBHOOKS, PLUGIN_PORT,
  SERVER_ADDRESS,
} from './constants.mjs';

import { accessoriesMap } from './accessories/index.mjs';

import { accessoriesFactory } from './lib/accessoriesFactory.mjs';
import { getPluginConfig } from './lib/getPluginConfig.mjs';
import { getRoutes } from './lib/getRoutes.mjs';
import { PluginApi } from './lib/PluginApi.mjs';
import { readConfig } from './lib/readConfig.mjs';

const config = readConfig(CONFIG_RELATIVE_PATH);
const homebridgeAddress = HOMEBRIDGE_ADDRESS === null ? config.homebridge.address : HOMEBRIDGE_ADDRESS;
const pluginDisableWebhooks = PLUGIN_DISABLE_WEBHOOKS === null ? config.plugin.disableWebhooks : PLUGIN_DISABLE_WEBHOOKS;
const pluginPort = PLUGIN_PORT === null ? config.plugin.port : PLUGIN_PORT;
const serverAddress = SERVER_ADDRESS === null ? config.server.address : SERVER_ADDRESS;

const baseUrl = `http://${serverAddress}:${config.server.port}`;
const pluginApi = new PluginApi({
  address: homebridgeAddress,
  disableWebhooks: pluginDisableWebhooks,
  port: pluginPort,
});
const accessories = accessoriesFactory(accessoriesMap, config.accessories, { baseUrl, pluginApi });
const pluginConfig = getPluginConfig(accessories, {
  platform: PLUGIN_CONFIG_PLATFORM,
  port: pluginPort,
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
