# Homebridge HTTP Webhooks Server

Server for the [homebridge-http-webhooks](https://github.com/benzman81/homebridge-http-webhooks) plugin.

## Quick Start

1. Assuming you have [Homebridge](https://homebridge.io) and **Homebridge HTTP Webhooks Plugin** set up and running,
  update the [config.json](#configjson) file according to your environment.
2. Install dependencies and launch the server:
  ```sh
  npm install
  npm start
  ```
3. Open `http://localhost:3000` that will provide you with the plugin configuration in JSON format.
4. Configure **Homebridge HTTP Webhooks Plugin** using the JSON provided by the server.

## Simulated Accessories

"Two-way" means the accessory is controlled from HomeBridge, but also will report its updated state or value when
triggered outside of **Homebridge**.

| Accessory   | Configuration Field | Supported Features                           |
| ----------- | ------------------- | -------------------------------------------- |
| Light       | `lights`            | Work in Progress                             |
| Push Button | `pushbuttons`       | Two-way push with GET requests               |
| Switch      | `switches`          | Two-way turning on and off with GET requests |

Usage of other than GET methods and any type of authorization is currently not supported.

## `config.json`

The server configuration file `config.json` differs from **Homebridge** and **Homebridge HTTP Webhooks Plugin**
configurations. However, its `accessories` object is designed to mimic plugin schema as much as possible. This way
accessories keys are the same as found in the plugin configuration: `lights`, `pushbuttons`, `switches`, etc.

For every accessory, you need to configure `id` and `name` to be similar to what is expected to be configured in the
plugin. Note, that you do not need to configure accessory-specific fields (such as `on_url`, `off_url`, etc.) specified
in the plugin configuration because the server will provide this for you.

Additionally, you need to configure some **Homebridge**, **Homebridge HTTP Webhooks Plugin**, and server parameters.

| Field                            | Type      | Description                                                                   |
| -------------------------------- | --------- | ----------------------------------------------------------------------------- |
| `accessories`                    | `Object`  | Object containing various accessories configuration                           |
| `accessories.lights`             | `Array`   | Array of Light accessory configurations                                       |
| `accessories.lights[].id`        | `string`  | Unique identifier for the light                                               |
| `accessories.lights[].name`      | `string`  | Name of the light                                                             |
| `accessories.pushbuttons`        | `Array`   | Array of Push Button accessory configurations                                 |
| `accessories.pushbuttons[].id`   | `string`  | Unique identifier for the push button                                         |
| `accessories.pushbuttons[].name` | `string`  | Name of the push button                                                       |
| `accessories.switches`           | `Array`   | Array of Switch accessory configurations                                      |
| `accessories.switches[].id`      | `string`  | Unique identifier for the switch                                              |
| `accessories.switches[].name`    | `string`  | Name of the switch                                                            |
| `homebridge`                     | `Object`  | Object containing **Homebridge** settings                                     |
| `homebridge.address`             | `string`  | IP address where the **Homebridge** server is running, example: `192.168.0.0` |
| `plugin`                         | `Object`  | Object containing **Homebridge HTTP Webhooks Plugin** settings                |
| `plugin.port`                    | `integer` | Port number configured in the plugin, example: `51828`                        |
| `server`                         | `Object`  | Object containing server settings                                             |
| `server.port`                    | `integer` | Port number for the server, example: `3000`                                   |
