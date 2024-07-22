# Homebridge HTTP Webhooks Server

Server for [homebridge-http-webhooks](https://github.com/benzman81/homebridge-http-webhooks) plugin.

## Quick Start

Configured devices to be simulated in `config.json`.

```sh
npm install
npm start
```

Open `http://localhost:3000` to find JSON config for the plugin.

## Simulated Accessories

"Two-way" means the accessory is controlled from HomeBridge, but also will report its updated state or value when
triggered outside of **Homebridge**.

| Accessory   | Field         | Supported Features                           |
| ----------- | ------------- | -------------------------------------------- |
| Push Button | `pushbuttons` | Two-way push with GET requests               |
| Switch      | `switches`    | Two-way turning on and off with GET requests |

Usage of other than GET methods and any type of authorization is currently not supported.

## `config.json`

The server configuration file `config.json` differs from **Homebridge** and **Homebridge HTTP Webhooks Plugin**
configurations. However, its `accessories` object is designed to mimic plugin schema as much as possible. This way
accessories keys are the same as found in the plugin configuration: `lights`, `pushbuttons`, `switches`, etc.

For every accessory, you need to configure `id` and `name` similar as expected to be configured in the plugin. Note,
that you do not need to configure accessory-specific fields (such as `on_url`, `off_url`, etc.) specified in the plugin
configuration because the server will provide this for you.

Additionally, you need to configure some **Homebridge**, **Homebridge HTTP Webhooks Plugin**, and server parameters.

| Field                               | Type    | Description                                                    |
| ----------------------------------- | ------- | -------------------------------------------------------------- |
| `accessories`                       | Object  | Object containing various accessories configuration            |
| - `accessories.lights`              | Array   | Array of light objects                                         |
| -- `accessories.lights[].id`        | string  | Unique identifier for the light                                |
| -- `accessories.lights[].name`      | string  | Name of the light                                              |
| - `accessories.pushbuttons`         | Array   | Array of push button objects                                   |
| -- `accessories.pushbuttons[].id`   | string  | Unique identifier for the push button                          |
| -- `accessories.pushbuttons[].name` | string  | Name of the push button                                        |
| - `accessories.switches`            | Array   | Array of switch objects                                        |
| -- `accessories.switches[].id`      | string  | Unique identifier for the switch                               |
| -- `accessories.switches[].name`    | string  | Name of the switch                                             |
| `homebridge`                        | Object  | Object containing **Homebridge** settings                      |
| - `homebridge.address`              | string  | IP address of the **Homebridge** server                        |
| `plugin`                            | Object  | Object containing **Homebridge HTTP Webhooks Plugin** settings |
| - `plugin.port`                     | integer | Port number for the plugin                                     |
| `server`                            | Object  | Object containing server settings                              |
| - `server.port`                     | integer | Port number for the server                                     |
