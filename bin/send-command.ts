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
    const msg = await client.getLastMsg()
    console.log("MSG: ", msg)

    function loading(url: string) {
        console.log("LOADING: ", url)
    }

    const msg2 = await client.enlarge("chat-messages-1074225966123057165-1086532268081815612", EnlargeType.U1, loading)
    //const msg2 = await client.enlarge("chat-messages-1074225966123057165-1086535947195260928", EnlargeType.V2, loading)
    console.log("MSG 2: ", msg2)
}

const words = ["galaxy", "kid", "house", "stars", "war"]
execute(words).then(res => {
    console.log("done")
})