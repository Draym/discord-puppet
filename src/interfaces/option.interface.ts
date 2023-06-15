export default interface Option {
    logs: boolean
    headless: boolean
    username: string
    password: string
    userDataDir?: string
    waitElement: number
    waitLogin: number
    waitExecution: number
    args: string[]
    ignoreDefaultArgs: boolean
}