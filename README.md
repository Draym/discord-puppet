# `Discord Puppet` ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) [![npm version](https://badge.fury.io/js/@d-lab%2Fdiscord-puppet.svg)](https://badge.fury.io/js/@d-lab%2Fdiscord-puppet)

Node client that simulates a Discord user in a headless browser. Use Discord functionalities including BOT interaction on the server-side. Include a Midjourney client which you can use to generate images using the `/imagine` command of Midjourney.

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

You will find different basic actions for Discord under the Puppet class. You can use it to create your own puppet, such as the Midjourney Puppet
described below.

#### Example

```ts
import {Puppet, options} from "@d-lab/discord-puppet"

const config: Option = options(
    process.env.DISCORD_USERNAME,
    process.env.DISCORD_PASSWORD
)
/** Setup Puppet config and pluggins */
const puppet = new Puppet(config)

/** Start Puppet opens a browser and a new Tab, handle Login then redirect to specified server or default one*/
await puppet.start()

await puppet.clickServer("My Server")
await puppet.clickChannel("my-channel")
await puppet.sendMessage("Hello world!")

/** close headless browser */
await puppet.shutdown()
```

### I18N support
Discord use different label in the code based on your language settings. You can specify the language you want to use in the config constructor.
For now only English and French are set up, but no worries there are only 3 labels to translate.

```ts
import {Puppet, buildOptions, Language, LanguagePack} from "@d-lab/discord-puppet"

const frLanguage: LanguagePack = new LanguagePack("fr", {
  "servers": "Serveurs",
  "channels": "Salons",
  "close": "Fermer"
})

const config: Option = buildOptions({
  username: process.env.DISCORD_USERNAME,
  password: process.env.DISCORD_PASSWORD,
  language: frLanguage
  //language: Language.EN
})
/** Setup Puppet config and pluggins */
const puppet = new Puppet(config)
```

## MidJourney Puppet

This library has been initially built to create a puppet for the MidJourney AI Art generation. This service is only available on Discord as a bot for
now.
Using this puppet you can easily generate AI art using the puppet.imagine() method on the server side.

#### Prerequisite

This Puppet is using the MidJourney Bot, you will need to add it to your server. You can find the bot on
the [MidJourney Website](https://www.midjourney.com/).

- Join MidJourney Discord
- If your discord user never used MidJourney before
    - run any command on MidJourney bot (such as imagine)
    - accept their Terms of Service
    - your user is set up!
- Create a new Personal Server on Discord: for example 'My
  Art' [steps](https://media.discordapp.net/attachments/1074234231175262248/1082211527790178384/image.png?width=1440&height=642)
- Add the bot to your personal server from MidJourney
  server [steps](https://media.discordapp.net/attachments/1074234231175262248/1082210468476764241/image.png?width=922&height=663)
- Add a new channel: for example 'all-art'
- You're good to go!

#### Example

```ts
import {MidjourneyPuppet, options} from "@d-lab/discord-puppet"

const config: Option = options(
    process.env.DISCORD_USERNAME,
    process.env.DISCORD_PASSWORD
)
const puppet = new MidjourneyPuppet(config)
await puppet.start()
await puppet.clickServer("My Art")
await puppet.clickChannel("all-art")

/** Get your MidJourney account status */
const msg1 = await puppet.info()
console.log("MJY account: ", msg1)

/** Ask MidJourney to generate an image */
// you can specify an optional callback that will receive the url of the image being generated on the fly
// you will receive multiple URLs every time MidJourney is updating the not-finished-image
// it can be usefull if you want to show the loading image to the user
function loading(url: string) {
    console.log("Loading ~ ", url)
}

const msg2 = await puppet.imagine(`Your Imagine prompt (check MidJourney prompt guides)`, loading)
console.log("MJY image: ", msg2)
```

## Test Locally

You can use the example script located in ./bin to try out this library.

First clone this repository on your local machine.

```bash
clone https://github.com/Draym/discord-puppet.git
cd discord-puppet
```

Then install the dependencies

```bash
npm i
```

Then create a .env file with your Discord credentials. You can check the file .env.example to see the mandatory fields.

Then run the example script

```bash
ts-node ./bin/midjourney-cmds.ts
```
