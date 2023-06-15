import Option from "../interfaces/option.interface"

export default function options(username: string,
                                password: string,
                                args: string[] = [],
                                userDataDir?: string,
                                logs = true,
                                headless = false,
                                waitLogin = 10,
                                waitElement = 1000,
                                waitExecution = 1000,
                                ignoreDefaultArgs = false): Option {
    return {
        username: username,
        password: password,
        userDataDir: userDataDir,
        logs: logs,
        headless: headless,
        waitLogin: waitLogin,
        waitElement: waitElement,
        waitExecution: waitExecution,
        args: args,
        ignoreDefaultArgs: ignoreDefaultArgs
    }
}