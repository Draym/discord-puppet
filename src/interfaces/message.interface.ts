import {ElementHandle} from "puppeteer"

export default interface Message {
    channelId: string
    messageId: string
    messageContent: string
    imageUrl?: string
    lazyImageUrl?: string

    article?: string
    actions: {[key: string]: ElementHandle}
}