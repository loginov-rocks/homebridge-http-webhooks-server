# Homebridge HTTP Webhooks Server

Server for the [homebridge-http-webhooks](https://github.com/benzman81/homebridge-http-webhooks) plugin.

## Quick Start

1. Assuming you have [Homebridge](https://homebridge.io) and **Homebridge HTTP Webhooks Plugin** set up and running,
  update the [config.json](#configjson) file according to your environment.
2. Install dependencies and launch the server (developed and tested on Node.js v20):
```sh
npm install
npm start
```
3. Open `http://localhost:3000` that will provide you with the plugin configuration in JSON format.
4. Configure **Homebridge HTTP Webhooks Plugin** using the JSON provided by the server.

### Docker

Assuming you have [Docker](https://www.docker.com) installed and the repository downloaded, create a Docker image and
start a new container:

```sh
docker build -t homebridge-http-webhooks-server .
docker run -p 3000:3000 homebridge-http-webhooks-server
```

Optionally you can override **Homebridge** and server IP addresses defined in [config.json](#configjson) by using the
[environment variables](#environment-variables):

```sh
docker run -e HOMEBRIDGE_ADDRESS=192.168.0.2 -e SERVER_ADDRESS=192.168.0.3 -p 3000:3000 homebridge-http-webhooks-server
```

If you run the server on the same computer as **Homebridge** and prefer to avoid using specific IP addresses, you can
run the Docker container in host network mode, which makes the container use the host's network stack.

This way, the server can communicate with the **Homebridge HTTP Webhooks Plugin** service hosted on the same machine by
accessing `127.0.0.1` or `localhost` (both values can be used in environment variables).

However, this approach has some security implications since it gives the container full access to the host's network.

```sh
docker run -e HOMEBRIDGE_ADDRESS=localhost -e SERVER_ADDRESS=localhost --network host homebridge-http-webhooks-server
```

```sh
docker run -e HOMEBRIDGE_ADDRESS=127.0.0.1 -e SERVER_ADDRESS=127.0.0.1 --network host homebridge-http-webhooks-server
```

## API

When the server is up and running, you can use the
[OpenAPI specification](https://github.com/loginov-rocks/homebridge-http-webhooks-server/blob/main/docs/openapi.yaml)
that describes all endpoints provided by the server in [Swagger UI](https://editor.swagger.io/) to trigger actions on
configured accessories outside of **Homebridge**.

Note, that you should start the server on port `3000` and open **Swagger UI** on the same computer as the server is
running because the default server URL configured in the OpenAPI specification is `localhost:3000`. Another option is
to edit the
[openapi.yaml](https://github.com/loginov-rocks/homebridge-http-webhooks-server/blob/main/docs/openapi.yaml) in
**Swagger UI** to point to the correct address and port.

Apart from the endpoints used by the plugin, the server exposes `_internal` endpoints for every accessory that can be
used to get the current internal state of the accessory, as well as a history of triggered events, or to update some
internal properties, for example, the current state or temperature for Thermostats.

## Simulated Accessories

"Two-way" means the accessory is controlled by **Homebridge**, but also will report its updated state or value when
triggered outside of **Homebridge**.

| Accessory          | Configuration Field | Supported Features                                       |
| ------------------ | ------------------- | -------------------------------------------------------- |
| Light              | `lights`            | Two-way turning on and off, brightness control           |
| Outlet             | `outlets`           | Two-way turning on and off, report outlet in use state   |
| Push Button        | `pushbuttons`       | Two-way push                                             |
| Temperature Sensor | `sensors`           | Report temperature                                       |
| Switch             | `switches`          | Two-way turning on and off                               |
| Thermostat         | `thermostats`       | Two-way current and target state and temperature control |

Usage of other than GET methods and any type of authorization is currently not supported.

## `config.json`

The server configuration file `config.json` differs from **Homebridge** and **Homebridge HTTP Webhooks Plugin**
configurations. However, its `accessories` object is designed to mimic plugin schema as much as possible. This way
accessories keys are the same as found in the plugin configuration: `lights`, `pushbuttons`, `switches`, etc.

For every accessory, you need to configure `id` and `name` to be similar to what is expected to be configured in the
plugin. Note, that you do not need to configure accessory-specific fields (such as `on_url`, `off_url`, etc.) specified
in the plugin configuration because the server will provide this for you.

Additionally, you need to configure some **Homebridge**, **Homebridge HTTP Webhooks Plugin**, and server parameters.

| Field                            | Type       | Description                                                                   |
| -------------------------------- | ---------- | ----------------------------------------------------------------------------- |
| `accessories`                    | `Object`   | Object containing various accessories configuration                           |
| `accessories.lights`             | `Array`    | Array of Light accessory configurations                                       |
| `accessories.lights[].id`        | `string`   | Unique identifier for the light                                               |
| `accessories.lights[].name`      | `string`   | Name of the light                                                             |
| `accessories.outlets`            | `Array`    | Array of Outlet accessory configurations                                      |
| `accessories.outlets[].id`       | `string`   | Unique identifier for the outlet                                              |
| `accessories.outlets[].name`     | `string`   | Name of the outlet                                                            |
| `accessories.pushbuttons`        | `Array`    | Array of Push Button accessory configurations                                 |
| `accessories.pushbuttons[].id`   | `string`   | Unique identifier for the push button                                         |
| `accessories.pushbuttons[].name` | `string`   | Name of the push button                                                       |
| `accessories.sensors`            | `Array`    | Array of Sensor accessory configurations                                      |
| `accessories.sensors[].id`       | `string`   | Unique identifier for the sensor                                              |
| `accessories.sensors[].name`     | `string`   | Name of the sensor                                                            |
| `accessories.sensors[].type`     | `string` * | Type of the sensor                                                            |
| `accessories.switches`           | `Array`    | Array of Switch accessory configurations                                      |
| `accessories.switches[].id`      | `string`   | Unique identifier for the switch                                              |
| `accessories.switches[].name`    | `string`   | Name of the switch                                                            |
| `accessories.thermostats`        | `Array`    | Array of Thermostat accessory configurations                                  |
| `accessories.thermostats[].id`   | `string`   | Unique identifier for the thermostat                                          |
| `accessories.thermostats[].name` | `string`   | Name of the thermostat                                                        |
| `homebridge`                     | `Object`   | Object containing **Homebridge** settings                                     |
| `homebridge.address`             | `string`   | IP address where the **Homebridge** server is running, example: `192.168.0.2` |
| `plugin`                         | `Object`   | Object containing **Homebridge HTTP Webhooks Plugin** settings                |
| `plugin.disableWebhooks`         | `boolean`  | Set to `true` to disable calls back to the plugin webhooks                    |
| `plugin.port`                    | `integer`  | Port number configured in the plugin, example: `51828`                        |
| `server`                         | `Object`   | Object containing server settings                                             |
| `server.address`                 | `string`   | IP address where the server is running, example: `192.168.0.3`                |
| `server.port`                    | `integer`  | Port number for the server, example: `3000`                                   |

* - Sensor types currently supported: `temperature`.

## Environment Variables

Optional, override `config.json`, useful when using Docker.

| Variable             | Type     | Description                                                                   |
| -------------------- | -------- | ----------------------------------------------------------------------------- |
| `HOMEBRIDGE_ADDRESS` | `string` | IP address where the **Homebridge** server is running, example: `192.168.0.2` |
| `SERVER_ADDRESS`     | `string` | IP address where the server is running, example: `192.168.0.3`                |
