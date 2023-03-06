import Puppet from "./puppet"
import Option from "./interfaces/option.interface"
import Message from "./interfaces/message.interface"
import {ElementHandle} from "puppeteer"

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
}