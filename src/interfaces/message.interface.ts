import Action from "./action.interface"

export default interface Message {
    channelId: string
    messageId: string
    messageContent: string
    imageUrl?: string
    lazyImageUrl?: string

    article?: string
    actions: Action[]
}