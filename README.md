# Homebridge HTTP Webhooks Server

Server for [homebridge-http-webhooks](https://github.com/benzman81/homebridge-http-webhooks) plugin.

## Quick Start

Configured devices to be simulated in `config.json`.

```sh
npm install
npm start
```

Open `http://localhost:3000` to find JSON config for the plugin.

## Supported Devices

### Switches

Config key: `switches`.

Required properties: `id`, `name`.
