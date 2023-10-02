import Puppet from "./puppet"
import {Message, Option} from "./interfaces"
import {ElementHandle} from "puppeteer"
import {EnlargeType, VariationType} from "./enums"
import {LoadingFn} from "./types/callback";

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
     * Validate if the image is ready and properly generated
     * @param loading you will be notified each time the image loading reach a new step
     * @param previousImageUrl the url of the previous image, to avoid getting the same image twice on network lags
     */
    protected validateImagineTask = (loading?: LoadingFn, previousImageUrl?: string) => {
        return async (elem: ElementHandle): Promise<boolean> => {
            const it = await this.getProperty(elem, 'href')
            if (loading) {
                loading(it)
            }
            return it != null && it.includes(".png") && it !== previousImageUrl
        }
    }

    /**
     * Request the generation of an image on Midjourney using your prompt
     * @param prompt a list of words or the description of the image you want
     * @param loading you will be notified each time the image loading reach a new step
     */
    async imagine(prompt: string, loading?: LoadingFn): Promise<Message> {
        const previous = await this.getLastMsg()
        await this.sendCommand("imagine", `${prompt}`)

        const validate = this.validateImagineTask(loading, previous.imageUrl)

        await this.waitElement('a[data-role="img"]', validate)
        await this.waitExecution()
        const final = await this.getLastMsg()
        if (final.messageId === previous.messageId) {
            throw new Error("The image was not generated")
        }
        if (!final.imageUrl) {
            throw new Error("The image was not generated")
        }
        return final
    }

    /**
     * Request an enlarge of the given image ID
     * @param messageId from imagine() response
     * @param option midjourney will create 4 images, you can enlarge any of those
     * @param loading you will be notified each time the image loading reach a new step
     */
    async imageEnlarge(messageId: string, option: EnlargeType, loading?: LoadingFn): Promise<Message> {
        const message = await this.getMessage(messageId)
        if (message.actions[option] == null) {
            throw new Error(`Option ${option} not found`)
        }
        const final = await this.executeImageAction(message.actions[option], message.imageUrl, loading)
        if (final.messageId === message.messageId) {
            throw new Error("The image was not enlarged")
        }
        if (!final.imageUrl) {
            throw new Error("The image was not generated")
        }
        return final
    }

    /**
     * Request a variation on the given image ID
     * @param messageId from imagine() response
     * @param option midjourney will create 4 images, you can get a variation any of those
     * @param loading you will be notified each time the image loading reach a new step
     */
    async imageVariation(messageId: string, option: VariationType, loading?: LoadingFn): Promise<Message> {
        const message = await this.getMessage(messageId)
        if (message.actions[option] == null) {
            throw new Error(`Option ${option} not found`)
        }
        const final = await this.executeImageAction(message.actions[option], message.imageUrl, loading)
        if (final.messageId === message.messageId) {
            throw new Error("The image was not varied")
        }
        if (!final.imageUrl) {
            throw new Error("The image was not generated")
        }
        return final
    }

    /**
     * Generate an image with the given prompt and enlarge it with the given option
     * @param prompt a list of words or the description of the image you want
     * @param option midjourney will create 4 images, you can enlarge any of those
     * @param loading you will be notified each time the image loading reach a new step
     */
    async imagineLarge(prompt: string, option: EnlargeType, loading?: LoadingFn) {
        const image = await this.imagine(prompt, loading)
        if (image.actions[option] == null) {
            throw new Error(`Option ${option} not found`)
        }
        const enlarged = await this.executeImageAction(image.actions[option], image.imageUrl, loading)
        if (enlarged.messageId === image.messageId) {
            throw new Error("The image was not enlarged")
        }
        if (!enlarged.imageUrl) {
            throw new Error("The image was not generated")
        }
        return enlarged
    }

    /**
     * Generate an image with the given prompt and generate an enlarged variation with the given option
     * @param prompt a list of words or the description of the image you want
     * @param option midjourney will create 4 images, you can enlarge a variation of those
     * @param loading you will be notified each time the image loading reach a new step
     */
    async imagineVariant(prompt: string, option: VariationType, loading?: LoadingFn) {
        const image = await this.imagine(prompt, loading)
        if (image.actions[option] == null) {
            throw new Error(`Option ${option} not found`)
        }
        const enlarged = await this.executeImageAction(image.actions[option], image.imageUrl, loading)
        if (enlarged.messageId === image.messageId) {
            throw new Error("The image didn't produce an enlarged variation")
        }
        if (!enlarged.imageUrl) {
            throw new Error("The image was not generated")
        }
        return enlarged
    }

    /**
     * Execute a given Image action (U1<>U4, V1<>V4) and wait for the new image to be loaded
     * @param action Based on the resp.actions[] from imagine()
     * @param parentUrl the url of the parent image that is being enlarged
     * @param loading you will be notified each time the image loading reach a new step
     */
    async executeImageAction(action: ElementHandle, parentUrl?: string, loading?: LoadingFn) {
        await action.click()

        const validate = this.validateImagineTask(loading, parentUrl)

        await this.waitElement('a[data-role="img"]', validate)
        return this.getLastMsg()
    }
}