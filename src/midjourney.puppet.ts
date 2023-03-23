import Puppet from "./puppet"
import {Option, Message} from "./interfaces"
import {ElementHandle} from "puppeteer"
import {EnlargeType, VariationType} from "./enums"

export default class MidjourneyPuppet extends Puppet {

    constructor(options: Option) {
        super(options);
    }

    /**
     * Get the info of your current Midjourney subscription
     */
    async info(): Promise<Message> {
        await this.sendCommand("info")
        await this.waitElement('div[id*="message-accessories"] > article')
        return this.getLastMsg()
    }

    /**
     * Request the generation of an image on Midjourney using your prompt
     * @param prompt a list of words or the description of the image you want
     * @param loading you will be notified each time the image loading reach a new step
     */
    async imagine(prompt: string, loading?: (string) => void): Promise<Message> {
        await this.sendCommand("imagine", `${prompt}`)
        async function validate(elem: ElementHandle): Promise<boolean> {
            const it = await this.getProperty(elem, 'href')
            if (loading) {
                loading(it)
            }
            return it != null && it.endsWith(".png")
        }
        await this.waitElement('a[data-role="img"]', validate.bind(this))
        return this.getLastMsg()
    }

    /**
     * Request an enlarge of the given image ID
     * @param messageId from imagine() response
     * @param option midjourney will create 4 images, you can enlarge any of those
     * @param loading you will be notified each time the image loading reach a new step
     */
    async imageEnlarge(messageId: string, option: EnlargeType, loading?: (string) => void): Promise<Message> {
        const message = await this.getMessage(messageId)
        if (message.actions[option] == null) {
            throw new Error(`Option ${option} not found`)
        }
        return this.executeImageAction(message.actions[option], loading)
    }

    /**
     * Request a variation on the given image ID
     * @param messageId from imagine() response
     * @param option midjourney will create 4 images, you can get a variation any of those
     * @param loading you will be notified each time the image loading reach a new step
     */
    async imageVariation(messageId: string, option: VariationType, loading?: (string) => void): Promise<Message> {
        const message = await this.getMessage(messageId)
        if (message.actions[option] == null) {
            throw new Error(`Option ${option} not found`)
        }
        return this.executeImageAction(message.actions[option], loading)
    }

    /**
     * Generate an image with the given prompt and enlarge it with the given option
     * @param prompt a list of words or the description of the image you want
     * @param option midjourney will create 4 images, you can enlarge any of those
     * @param loading you will be notified each time the image loading reach a new step
     */
    async imagineLarge(prompt: string, option: EnlargeType, loading?: (string) => void) {
        const resp = await this.imagine(prompt)
        if (resp.actions[option] == null) {
            throw new Error(`Option ${option} not found`)
        }
        return this.executeImageAction(resp.actions[option], loading)
    }

    /**
     * Execute a given Image action (U1<>U4, V1<>V4) and wait for the image to be loaded
     * @param action Based on the resp.actions[] from imagine()
     * @param loading you will be notified each time the image loading reach a new step
     */
    async executeImageAction(action: ElementHandle, loading?: (string) => void) {
        await action.click()
        await (new Promise(r => setTimeout(r, 2000)))
        async function validate(elem: ElementHandle): Promise<boolean> {
            const it = await this.getProperty(elem, 'href')
            if (loading) {
                loading(it)
            }
            return it != null && it.endsWith(".png")
        }
        await this.waitElement('a[data-role="img"]', validate.bind(this))
        return this.getLastMsg()
    }
}