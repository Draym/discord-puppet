import 'dotenv/config'
import Option from "../src/interfaces/option.interface"
import options from "../src/utils/options"
import MidjourneyPuppet from "../src/midjourney.puppet"

/** TEST script that execute midjourney puppet **/
async function execute(words: string[]) {
    const config: Option = options(
        process.env.DISCORD_USERNAME,
        process.env.DISCORD_PASSWORD,
        [],
        process.env.DISCORD_USER_DATA_DIR
    )
    const client = new MidjourneyPuppet(config)
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