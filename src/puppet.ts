import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import UserDir from "puppeteer-extra-plugin-user-data-dir"
import {Browser, ElementHandle, Page} from "puppeteer"
import * as console from "console"
import {Message, Ids, Option} from "./interfaces"

export default class Puppet {
    protected browser: Browser
    protected page: Page
    protected options: Option

    constructor(options: Option) {
        puppeteer.use(StealthPlugin())
        puppeteer.use(UserDir())
        this.options = options
    }

    async start(serverId?: string) {
        this.browser = await puppeteer.launch({
            headless: this.options.headless,
            userDataDir: this.options.userDataDir,
            args: this.options.args
        })
        this.page = await this.browser.newPage()
        if (serverId != null) {
            await this.goToServer(serverId)
        } else {
            await this.goToMain()
        }
        await this.login()
        await (new Promise(r => setTimeout(r, 1000)))
    }

    async shutdown() {
        await this.browser.close()
    }

    async goToMain() {
        this.log(`[Main]: go`)
        await this.page.goto('https://discord.com/app', {waitUntil: 'load'})
        await (new Promise(r => setTimeout(r, 1000)))
        this.log(`[Main]: done`)
    }

    async gotToChannel(serverId: string, channelId: string) {
        this.log(`channel[${serverId}, ${channelId}]: go`)
        await this.page.goto(`https://discord.com/channels/${serverId}/${channelId}`, {waitUntil: 'load'})
        this.log(`channel[${serverId}, ${channelId}]: navigate`)
        await this.page.waitForSelector(`ol[data-list-id="chat-messages"]`, {visible: true})
        await (new Promise(r => setTimeout(r, 1000)))
        this.log(`channel[${serverId}, ${channelId}]: done`)
    }

    async goToServer(serverId: string) {
        this.log(`server[${serverId}]: go`)
        await this.page.goto(`https://discord.com/channels/${serverId}`, {waitUntil: 'load'})
        this.log(`server[${serverId}]: navigate`)
        await this.page.waitForSelector(`div[aria-label="Servers"]`, {visible: true})
        await (new Promise(r => setTimeout(r, 1000)))
        this.log(`server[${serverId}]: done`)
    }

    async clickChannel(channel: string) {
        this.log(`channel[${channel}]: click`)
        await this.page.waitForSelector(`a[aria-label*="${channel}"]`, {visible: true})
        await this.page.click(`a[aria-label*="${channel}"]`)
        this.log(`channel[${channel}]: navigation`)
        await this.page.waitForSelector(`ol[data-list-id="chat-messages"]`, {visible: true})
        this.log(`channel[${channel}]: done`)
    }

    async clickServer(server: string) {
        this.log(`server[${server}]: click`)
        await this.page.waitForSelector(`div[aria-label="Servers"]`, {visible: true})
        await this.page.waitForSelector(`div[data-dnd-name="${server}"]`, {visible: true})
        await this.page.click(`div[data-dnd-name="${server}"]`)
        this.log(`server[${server}]: navigation`)
        await this.page.waitForSelector(`ul[aria-label="Channels"]`, {visible: true})
        this.log(`server[${server}]: done`)
    }

    async sendMessage(message: string) {
        this.log(`send message{${message}}`)
        await this.page.click('[data-slate-editor="true"]')
        await this.page.type('[data-slate-editor="true"]', message)
        await this.page.keyboard.press('Enter')
    }

    async sendCommand(command: string, args?: string) {
        this.log(`send command{${command}: ${args}}`)
        await this.page.click('[data-slate-editor="true"]')
        await this.page.keyboard.press('/')
        await (new Promise(r => setTimeout(r, 1000)))
        await this.page.type('[data-slate-editor="true"]', `${command}`)
        await (new Promise(r => setTimeout(r, 2000)))
        await this.page.keyboard.press('Enter')
        await (new Promise(r => setTimeout(r, 500)))
        if (args != null) {
            await this.page.type('[data-slate-editor="true"]', `${args}`)
        }
        await this.page.keyboard.press('Enter')
        await (new Promise(r => setTimeout(r, 1000)))
    }

    async getLastMsgRaw(): Promise<ElementHandle> {
        await this.page.waitForSelector('ol[data-list-id="chat-messages"] > li:last-of-type')
        return await this.page.$('ol[data-list-id="chat-messages"] > li:last-of-type')
    }


    async getLastMsg(): Promise<Message> {
        await this.page.waitForSelector('ol[data-list-id="chat-messages"] > li:last-of-type')
        const li = await this.page.$('ol[data-list-id="chat-messages"] > li:last-of-type')
        return this.parseMessage(li)
    }

    async getMessage(messageId: string): Promise<Message> {
        const li = await this.page.$(`li[id="${messageId}"]`)
        if (li == null) {
            throw new Error(`Message ${messageId} not found`)
        }
        return await this.parseMessage(li)
    }

    async parseMessage(li: ElementHandle): Promise<Message> {
        const liId = await this.getProperty(li, 'id')
        const {channelId, messageId} = this.parseIds(liId)
        await this.page.waitForSelector(`li[id="${liId}"] div[id="message-content-${messageId}"]`)
        const content = await li.$eval(`div[id="message-content-${messageId}"]`, it => it.textContent)
        const aTag = await li.$('a[data-role="img"]')
        const imgTag = await li.$('img[alt="Image"]')
        const imageUrl = await this.getProperty(aTag, 'href')
        const lazyImageUrl = await this.getProperty(imgTag, 'src')
        const article = await li.$('div[class*="embedDescription"]')
        let articleContent = null
        if (article != null) {
            articleContent = await li.$eval('div[class*="embedDescription"]', it => it.textContent)
        }
        const accessories = await li.$('div[id*="message-accessories"]')
        const divs = await accessories.$$('button');
        const actions = {};
        for (const div of divs) {
            const textContent = await div.evaluate(el => el.textContent)
            if (textContent.startsWith('U') || textContent.startsWith('V')) {
                actions[textContent] = div
            }
        }
        return {
            channelId: channelId,
            messageId: messageId,
            messageContent: content,
            imageUrl: imageUrl,
            lazyImageUrl: lazyImageUrl,
            article: articleContent,
            actions: actions
        }
    }

    parseIds(id: string): Ids {
        const ids = id.split("-")
        return {
            channelId: ids[2],
            messageId: ids[3]
        }
    }

    async getProperty(elem: ElementHandle | null, property: string): Promise<string | null> {
        const jsProperty = await elem?.getProperty(property)
        return await jsProperty?.jsonValue()
    }

    async login(): Promise<boolean> {
        if (await this.isLoggedIn()) {
            return true
        }
        try {
            this.log("[login]: type")
            await this.page.type('input[name="email"]', this.options.username)
            await this.page.type('input[name="password"]', this.options.password)
            await this.page.click('button[type="submit"]')
            this.log("[login]: submit")
            await this.page.waitForNavigation({waitUntil: 'load'})
            //await (new Promise(r => setTimeout(r, 1000)))
        } catch (e) {
            this.log("[login]: fail=", e)
        }
        const isLoggedIn = await this.waitLogin()
        if (isLoggedIn) {
            this.log('[login] successful!')
        } else {
            this.log('[login] failed!')
        }
        return isLoggedIn
    }

    async isLoggedIn(): Promise<boolean> {
        const sidebar = await this.page.$('div[class*="sidebar"]')
        this.log("[login]: is in? ", sidebar !== null ? "yes" : "no")
        return sidebar !== null
    }

    async waitLogin(): Promise<boolean> {
        this.log("[login]: wait")
        let tryCount = 0
        let isLoggedIn = await this.isLoggedIn()
        while (!isLoggedIn && tryCount < this.options.waitLogin) {
            isLoggedIn = await this.isLoggedIn()
            tryCount++
            if (isLoggedIn || tryCount >= this.options.waitLogin) {
                break
            }
            await (new Promise(r => setTimeout(r, 1000)))
        }
        return isLoggedIn
    }

    async waitElement(requiredEval: string, validate?: (ElementHandle) => Promise<boolean>) {
        let tryCount = 0

        while (tryCount < this.options.waitElement) {
            const last: ElementHandle = await this.getLastMsgRaw()
            const found = await last.$(requiredEval)
            let isValid = found != null
            if (isValid && validate != null) {
                isValid = await validate(found)
            }
            this.log(`[waitElement]: found[${found !== null ? "yes" : "no"}] valid[${isValid ? "yes" : "no"}]`)
            tryCount++
            if (isValid || tryCount >= this.options.waitElement) {
                break
            }
            await (new Promise(r => setTimeout(r, 1000)))
        }
    }

    private log(message: string, ...args) {
        if (this.options.logs) {
            const time = new Date().toISOString()
            console.log(message, ...args, time)
        }
    }
}