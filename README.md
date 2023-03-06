# `Discord Puppet` ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) [![npm version](https://badge.fury.io/js/@d-lab%2Fdiscord-puppet.svg)](https://badge.fury.io/js/@d-lab%2Fdiscord-puppet)
Node client that simulates a Discord user in a headless browser

[available on NPM](https://www.npmjs.com/package/@d-lab/discord-puppet)

## Installation

```bash
npm i @d-lab/discord-puppet 
```

Discord Puppet is using Puppeteer to simulate a Discord user in a headless browser.
If you want to run it on a headless browser, you may have to install addition depencies based on your OS.

For Debian UI-less: [check tavinus GIST](https://gist.github.com/tavinus/7effd4b3dac87cb4366e3767679a192f)
```bash
sudo apt install libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libgbm1 libasound2 libpangocairo-1.0-0 libxss1 libgtk-3-0
```


## Discord Puppet base SDK

You will find different basic actions for Discord under the Puppet class. You can use it to create your own puppet, such as the Midjourney Puppet described below.

Interface
```ts
interface Puppet {
    start(serverId?: string)
    shutdown()
    goToMain()
    gotToChannel(serverId: string, channelId: string)
    goToServer(serverId: string)
    clickChannel(channel: string)
    clickServer(server: string)
    sendMessage(message: string)
    sendCommand(command: string, args?: string)
    getLastMsgRaw()
    getLastMsg()
    parseMessage(li: ElementHandle)
    parseIds(id: string): Ids
    getProperty(elem: ElementHandle | null, property: string): Promise<string | null>
    login(): Promise<boolean>
    isLoggedIn(): Promise<boolean>
    waitLogin(): Promise<boolean>
    waitElement(requiredEval: string, validate?: (ElementHandle) => Promise<boolean>)
}
```
#### Example
```ts
import {Client as Puppet} from "@d-lab/discord-puppet"

const config: Option = options(
    process.env.DISCORD_USERNAME,
    process.env.DISCORD_PASSWORD
)
const puppet = new Puppet(config)
await puppet.start()
await puppet.clickServer("My Server")
await puppet.clickChannel("my-channel")
await puppet.sendMessage("Hello world!")
await puppet.shutdown()
```

## MidJourney Puppet

This library has been initially built to create a puppet for the MidJourney AI Art generation. This service is only available on Discord as a bot for now.
Using this puppet you can easily generate AI art using the puppet.imagine() method on the server side.

```ts
import {Client as Puppet} from "@d-lab/discord-puppet"

const config: Option = options(
    process.env.DISCORD_USERNAME,
    process.env.DISCORD_PASSWORD,
    process.env.DISCORD_USER_DATA_DIR
)
const puppet = new MidjourneyPuppet(config)
await puppet.start()
await puppet.clickServer("My Art")
await puppet.clickChannel("all-art")

/** Get your MidJourney account status */
const msg1 = await client.info()
console.log("MJY account: ", msg1)

/** Ask MidJourney to generate an image */
// you can specify an optional callback that will receive the url of the image being generated on the fly
// you will receive multiple URLs every time MidJourney is updating the not-finished-image
// it can be usefull if you want to show the loading image to the user
function loading(url: string) {
    console.log("Loading ~ ", url)
}
const msg2 = await client.imagine(`Your Imagine command (check MidJourney prompt guides)`, loading)
console.log("MJY image: ", msg2)
```