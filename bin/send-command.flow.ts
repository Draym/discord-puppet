import 'dotenv/config'
import MidjourneyPuppet from "../src/midjourney.puppet"
import Option from "../src/interfaces/option.interface"

/** TEST script that execute midjourney puppet **/
async function execute(words: string[]) {
    const options: Option = {
        logs: true,
        headless: false,
        username: process.env.DISCORD_USERNAME,
        password: process.env.DISCORD_PASSWORD,
        userDataDir: process.env.DISCORD_USER_DATA_DIR,
        waitLogin: 10,
        waitElement: 100
    }
    const client = new MidjourneyPuppet(options)
    await client.start()
    await client.clickServer("My AI Art")
    await client.clickChannel("words-tell-art")
    const msg = await client.info()
    console.log("MSG: ", msg)

    function loading(url: string) {
        console.log("LOADING: ", url)
    }
    const msg2 = await client.imagine(`cyberpunk, ${words.join(" ")}, film noir, colourful, minimal environment`, loading)
    console.log("MSG 2: ", msg2)
}

const words = ["galaxy", "kid", "house", "stars", "war"]
execute(words).then(res => {
  console.log("done")
})