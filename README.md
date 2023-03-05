# `Discord Puppet` ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) [![npm version](https://badge.fury.io/js/@d-lab%2Fdiscord-puppet.svg)](https://badge.fury.io/js/@d-lab%2Fdiscord-puppet)
Node client that simulates a Discord user in a headless browser

[available on NPM](https://www.npmjs.com/package/@d-lab/discord-puppet)

## Installation

```bash
npm i @d-lab/discord-puppet 
```

## Usage

```ts
import {Client as Puppet} from "@d-lab/discord-puppet"

const options = {
    logs: true,
    headless: false,
    username: process.env.DISCORD_USERNAME,
    password: process.env.DISCORD_PASSWORD
}
const puppet = new Client(options)
await puppet.start()
await puppet.changeChannel("channel")
await puppet.sendMessage("message")
await puppet.sendCommand("command")
await puppet.shutdown()
```