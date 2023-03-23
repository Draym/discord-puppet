import Puppet from "./puppet"
import {Option, Message} from "./interfaces"
import {ElementHandle} from "puppeteer"
import {EnlargeType} from "./enums"

export default class MidjourneyPuppet extends Puppet {

    constructor(options: Option) {
        super(options);
    }

    async info(): Promise<Message> {
        await this.sendCommand("info")
        await this.waitElement('div[id*="message-accessories"] > article')
        return this.getLastMsg()
    }

    async imagine(command: string, loading?: (string) => void): Promise<Message> {
        await this.sendCommand("imagine", `${command}`)
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

    async enlarge(messageId: string, option: EnlargeType, loading?: (string) => void): Promise<Message> {
        const li = await this.page.$(`li[id="${messageId}"]`)
        if (li == null) {
            throw new Error(`Message ${messageId} not found`)
        }
        const message = await this.parseMessage(li)
        if (message.actions[option] == null) {
            throw new Error(`Option ${option} not found`)
        }
        await message.actions[option].click()
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