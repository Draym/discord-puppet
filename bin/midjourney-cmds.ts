import 'dotenv/config'
import Option from "../src/interfaces/option.interface"
import options from "../src/utils/options"
import MidjourneyPuppet from "../src/midjourney.puppet"
import {EnlargeType} from "../src/enums"

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
    await client.clickChannel("general")

    const msg1 = await client.info()
    console.log("Midjourney Account info: ", msg1)

    function loading(url: string) {
        console.log("LOADING: ", url)
    }
    const msg2 = await client.imagine(words.join(" "), loading)
    console.log("Images: ", msg2)
    const msg3 = await client.enlarge(msg2.messageId, EnlargeType.U1, loading)
    console.log("Enlarged U1 image: ", msg3)
}

const words = ["galaxy", "kid", "house", "stars", "travel"]
execute(words).then(res => {
    console.log("done")
})