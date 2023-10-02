import {ElementHandle} from "puppeteer"
import Ids from "./ids.interface"
import {ValidateFn} from "../types/callback";

export default interface PuppetInterface {
    start(serverId?: string)
    shutdown()
    goToMain()
    gotToChannel(serverId: string, channelId: string)
    goToServer(serverId: string)
    clickChannel(channel: string)
    clickServer(server: string)
    sendMessage(message: string)
    sendCommand(command: string, args?: string)
    getLastMsgRaw()
    getLastMsg()
    parseMessage(li: ElementHandle)
    parseIds(id: string): Ids
    getProperty(elem: ElementHandle | null, property: string): Promise<string | null>
    login(): Promise<boolean>
    isLoggedIn(): Promise<boolean>
    waitLogin(): Promise<boolean>
    waitElement(requiredEval: string, validate?: ValidateFn)
}