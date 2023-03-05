import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import {Browser, Page} from "puppeteer"
import Option from "./option.interface"
import * as console from "console"

export default class Client {
    private browser: Browser
    private page: Page
    private options: Option

    constructor(options: Option) {
        puppeteer.use(StealthPlugin())
        this.options = options
    }
    async start() {
        this.browser = await puppeteer.launch({ headless: false })
        this.page = await this.browser.newPage()
        await this.goToMain()
        await this.login()
    }

    async shutdown() {
        await this.browser.close()
    }

    async goToMain() {
        this.log(`go to Main`)
        await this.page.goto('https://discord.com/app', { waitUntil: 'load' })
    }

    async goToChannel(channel: string) {
        this.log(`go to channel[${channel}]`)
        await this.page.waitForSelector(`a[href="/channels/${channel}"]`);
        await this.page.click(`a[href="/channels/${channel}"]`)
    }

    async goToServer(server: string) {
        this.log(`go to server[${server}]`)
        await this.page.waitForSelector(`div[data-dnd-name="${server}"]`);
        await this.page.click(`div[data-dnd-name="${server}"]`)
        // const divElement = await this.page.$(`div[data-dnd-name="${server}"]`);
        // await divElement.click();
    }

    async sendMessage(message: string) {
        this.log(`send message[${message}]`)
        await this.page.click('[data-slate-editor="true"]');
        await this.page.type('[data-slate-editor="true"]', message);
        await this.page.keyboard.press('Enter');
    }

    async sendCommand(command: string, args: string) {
        this.log(`send command[${command}: ${args}]`)
        await this.page.click('[data-slate-editor="true"]');
        await this.page.keyboard.press('/');
        await (new Promise(r => setTimeout(r, 1000)))
        await this.page.type('[data-slate-editor="true"]', `${command}`);
        await (new Promise(r => setTimeout(r, 2000)))
        await this.page.keyboard.press('Enter');
        await (new Promise(r => setTimeout(r, 2000)))
        await this.page.type('[data-slate-editor="true"]', `${args}`);
        await this.page.keyboard.press('Enter');
    }

    async getLastMsg(): Promise<string> {
        return await this.page.$eval('ol[aria-label="Messages in words-tell-art"] > li:last-of-type', li => li);
    }

    async getCmdResponse(): Promise<string> {
        await (new Promise(r => setTimeout(r, 10000)))
        return await this.page.$eval('ol[aria-label="Messages in words-tell-art"] > li:last-of-type', li => li);
    }

    async getResponseLazyImg(): Promise<string> {
        await (new Promise(r => setTimeout(r, 10000)))
        const lastLi = await this.page.$eval('ol[aria-label="Messages in words-tell-art"] > li:last-of-type', li => li);
        // TODO lastLi was null, so maybe eval is wrong, try to make getLastMsg work first
        const liId = await lastLi.getProperty('id');
        await this.page.waitForSelector(`ol[aria-label="Messages in words-tell-art"] li[id=${liId}] a[data-role=img]`);
        const aHandle = await lastLi.$('a[data-role=img]');
        return await aHandle.getProperty('href');
    }

    private async login(): Promise<boolean> {
        if (await this.isLoggedIn()) {
            return true
        }
        try {
            this.log("login")
            await this.page.type('input[name="email"]', this.options.username)
            await this.page.type('input[name="password"]', this.options.password)
            await this.page.click('button[type="submit"]')
            this.log("submit")
            await this.page.waitForNavigation()
        } catch (e) {
            this.log("Login fail:", e)
        }
        const isLoggedIn = await this.waitLogin()
        if (isLoggedIn) {
            this.log('Login successful!')
        } else {
            this.log('Login failed!')
        }
        return isLoggedIn
    }

    async isLoggedIn(): Promise<boolean> {
        this.log("is logged in?")
        return await this.page.evaluate(() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return document.querySelector('div[class^="sidebar"]') !== null
        })
    }

    async waitLogin(): Promise<boolean> {
        this.log("wait login")
        let tryCount = 0
        let isLoggedIn = await this.isLoggedIn()
        while (!isLoggedIn && tryCount < 10) {
            isLoggedIn = await this.isLoggedIn()
            tryCount++
            await setTimeout(() => {}, 1000)
        }
        return isLoggedIn
    }
    
    private log(message: string, ...args) {
        if (this.options.logs) {
            console.log(message, ...args)
        }
    }
}