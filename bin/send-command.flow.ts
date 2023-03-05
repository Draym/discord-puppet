import 'dotenv/config'
import Client from "../src/client"

/** TEST script that execute midjourney bot**/
async function execute(words: string[]) {
    const options = {
        logs: true,
        headless: false,
        username: process.env.DISCORD_USERNAME,
        password: process.env.DISCORD_PASSWORD
    }
    const client = new Client(options)
    await client.start()
    await client.goToServer("My AI Art")
    await client.goToChannel("1074225966123057162/1078258028618453022")
    await client.sendCommand("imagine", `cyberpunk, ${words.join(" ")}, film noir, colourful, minimal environment`)
    const url = await client.getResponseLazyImg()
    console.log("URL: ", url)
}

const words = ["skyscraper", "plane", "mountain", "pokemon", "peace"]
execute(words).then(res => {
  console.log("done")
})