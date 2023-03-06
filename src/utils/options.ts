import Option from "../interfaces/option.interface"

export default function options(username: string, password: string, userDataDir?: string, logs = true, headless = false, waitLogin = 10, waitElement = 100): Option {
    return {
        username: username,
        password: password,
        userDataDir: userDataDir,
        logs: logs,
        headless: headless,
        waitLogin: waitLogin,
        waitElement: waitElement
    }
}