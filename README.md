# Homebridge HTTP Webhooks Server

Server for the [homebridge-http-webhooks](https://github.com/benzman81/homebridge-http-webhooks) plugin.

<!-- no toc -->
* [Quick Start](#quick-start)
  * [Docker](#docker)
* [Architecture](#architecture)
  * [Components and Communication](#components-and-communication)
  * [Networks](#networks)
  * [Options](#options)
    * [Option A) Standalone Server](#option-a-standalone-server)
    * [Option B) Homebridge Server](#option-b-homebridge-server)
* [API](#api)
* [Emulated Accessories](#emulated-accessories)
* [config.json](#configjson)
* [Environment Variables](#environment-variables)

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

## Architecture

The **Homebridge HTTP Webhooks Server** acts as a middleware to integrate custom devices and services that do not
support HomeKit, **Homebridge**, or the **HomeHomebridge HTTP Webhooks Plugin** API. It helps translate data and
commands enabling control of external devices and services through the **Apple Home App**. The server can be deployed
on the same machine as **Homebridge** or to a **Standalone Server**.

![Component View](https://raw.githubusercontent.com/loginov-rocks/homebridge-http-webhooks-server/main/docs/Component-View.png)

### Components and Communication

1. **Apple Home Users** interact with the Apple Home ecosystem using **Apple Client Devices**.
2. **Apple Client Devices** such as iPhones, iPads, and Macs run the **Apple Home App**:
    * Provide _local access_ to **Homebridge** if they are on the same network.
    * Provide _remote access_ to **Homebridge** over the **Apple Home Hub** if they aren't on the same network.
3. **Apple Home App** installed on **Apple Client Devices** allows users to manage their HomeKit-enabled devices.
4. **Apple Home Hub** is a device such as an Apple TV, HomePod, or iPad that acts as a hub for HomeKit:
    * Provides _local_ and _remote access_ to **Homebridge** (disclaimer: this description is simplified).
5. **Homebridge Server** is a device such as Raspberry Pi running **Homebridge**:
    * Hosts the **Homebridge HTTP Webhooks Plugin** to integrate with custom devices and services supporting its API.
    * Communicates with the **Apple Home App** and HomeKit over the LAN via emulating the HomeKit API.
6. **Homebridge HTTP Webhooks Plugin** uses its API to interface with custom devices and services.
7. **Homebridge HTTP Webhooks Server**:
    * Communicates with **Homebridge HTTP Webhooks Plugin** using the _plugin API_.
    * Interfaces with **Controlled Devices** and **Services** using their _custom APIs_.
    * Can be deployed on the server running **Homebridge** or to a **Standalone Server** located in the same network.
8. **Controlled Devices** and **Services** managed via their _custom APIs_:
    * Can be located either in the same or another network accessible over the public internet.

### Networks

1. **LAN** (Local Area Network) is used for communication between **Apple Client Devices**, the **Apple Home Hub**, the
   **Homebridge Server**, and the **Homebridge HTTP Webhooks Server** (in case deployed on a **Standalone Server**).
2. **Public Internet** is used for remote access, allowing **Apple Client Devices** to communicate with the **Apple
   Home Hub** when not connected to the same network.

### Options

#### Option A) Standalone Server

The **Homebridge HTTP Webhooks Server** is deployed on a **Standalone Server** rather than on the server running
**Homebridge** and communicates with the **Homebridge HTTP Webhooks Plugin** over the LAN.

#### Option B) Homebridge Server

The **Homebridge HTTP Webhooks Server** is deployed on the same server as **Homebridge** and communicates with the
**Homebridge HTTP Webhooks Plugin** over the localhost.

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

## Emulated Accessories

"Two-way" means the accessory is controlled by **Homebridge**, but also will report its updated state or value when
triggered outside of **Homebridge**.

| Accessory          | Configuration Field | Supported Features                                       |
| ------------------ | ------------------- | -------------------------------------------------------- |
| Contact Sensor     | `sensors`           | Report in contact state                                  |
| Humidity Sensor    | `sensors`           | Report humidity                                          |
| Light              | `lights`            | Two-way turning on and off, brightness control           |
| Motion Sensor      | `sensors`           | Report in motion state                                   |
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

| Field                            | Type      | Description                                                                   |
| -------------------------------- | --------- | ----------------------------------------------------------------------------- |
| `accessories`                    | `Object`  | Object containing various accessories configuration                           |
| `accessories.lights`             | `Array`   | Array of Light accessory configurations                                       |
| `accessories.lights[].id`        | `string`  | Unique identifier for the light                                               |
| `accessories.lights[].name`      | `string`  | Name of the light                                                             |
| `accessories.outlets`            | `Array`   | Array of Outlet accessory configurations                                      |
| `accessories.outlets[].id`       | `string`  | Unique identifier for the outlet                                              |
| `accessories.outlets[].name`     | `string`  | Name of the outlet                                                            |
| `accessories.pushbuttons`        | `Array`   | Array of Push Button accessory configurations                                 |
| `accessories.pushbuttons[].id`   | `string`  | Unique identifier for the push button                                         |
| `accessories.pushbuttons[].name` | `string`  | Name of the push button                                                       |
| `accessories.sensors`            | `Array`   | Array of Sensor accessory configurations                                      |
| `accessories.sensors[].id`       | `string`  | Unique identifier for the sensor                                              |
| `accessories.sensors[].name`     | `string`  | Name of the sensor                                                            |
| `accessories.sensors[].type`     | `string`  | Type of the sensor (see below)                                                |
| `accessories.switches`           | `Array`   | Array of Switch accessory configurations                                      |
| `accessories.switches[].id`      | `string`  | Unique identifier for the switch                                              |
| `accessories.switches[].name`    | `string`  | Name of the switch                                                            |
| `accessories.thermostats`        | `Array`   | Array of Thermostat accessory configurations                                  |
| `accessories.thermostats[].id`   | `string`  | Unique identifier for the thermostat                                          |
| `accessories.thermostats[].name` | `string`  | Name of the thermostat                                                        |
| `homebridge`                     | `Object`  | Object containing **Homebridge** settings                                     |
| `homebridge.address`             | `string`  | IP address where the **Homebridge** server is running, example: `192.168.0.2` |
| `plugin`                         | `Object`  | Object containing **Homebridge HTTP Webhooks Plugin** settings                |
| `plugin.disableWebhooks`         | `boolean` | Set to `true` to disable calls back to the plugin webhooks                    |
| `plugin.port`                    | `integer` | Port number configured in the plugin, example: `51828`                        |
| `server`                         | `Object`  | Object containing server settings                                             |
| `server.address`                 | `string`  | IP address where the server is running, example: `192.168.0.3`                |
| `server.port`                    | `integer` | Port number for the server, example: `3000`                                   |

Sensor types currently supported: `contact`, `humidity`, `motion`, `temperature`.

## Environment Variables

Optional, override `config.json`, useful when using Docker.

| Variable                  | Type      | Description                                                                   |
| ------------------------- | --------- | ----------------------------------------------------------------------------- |
| `HOMEBRIDGE_ADDRESS`      | `string`  | IP address where the **Homebridge** server is running, example: `192.168.0.2` |
| `PLUGIN_DISABLE_WEBHOOKS` | `boolean` | Set to `true` to disable calls back to the plugin webhooks                    |
| `PLUGIN_PORT`             | `integer` | Port number configured in the plugin, example: `51828`                        |
| `SERVER_ADDRESS`          | `string`  | IP address where the server is running, example: `192.168.0.3`                |
