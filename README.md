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

#### Example
```ts
import {Client as Puppet} from "@d-lab/discord-puppet"

const config: Option = options(
    process.env.DISCORD_USERNAME,
    process.env.DISCORD_PASSWORD
)
/** Setup Puppet config and pluggin, it uses StealthPlugin and UserDataDir */
const puppet = new Puppet(config)

/** Start Puppet opens a browser and a new Tab, handle Login then redirect to specified server or default one*/
await puppet.start()

await puppet.clickServer("My Server")
await puppet.clickChannel("my-channel")
await puppet.sendMessage("Hello world!")

/** close headless browser */
await puppet.shutdown()
```

## MidJourney Puppet

This library has been initially built to create a puppet for the MidJourney AI Art generation. This service is only available on Discord as a bot for now.
Using this puppet you can easily generate AI art using the puppet.imagine() method on the server side.

#### Prerequisite
This Puppet is using the MidJourney Bot, you will need to add it to your server. You can find the bot on the [MidJourney Website](https://www.midjourney.com/).

- Join MidJourney Discord
- If your discord user never used MidJourney before
  - run any command on MidJourney bot (such as imagine)
  - accept their Terms of Service
  - your user is setup!
- Create a new Personal Server on Discord: for example 'My Art' [steps](https://media.discordapp.net/attachments/1074234231175262248/1082211527790178384/image.png?width=1440&height=642)
- Add the bot to your personal server from MidJourney server [steps](https://media.discordapp.net/attachments/1074234231175262248/1082210468476764241/image.png?width=922&height=663)
- Add a new channel: for example 'all-art'
- You're good to go!

#### Example
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