import Option, {PartialOption} from "../interfaces/option.interface"
import Language from "../enums/language";
import LanguagePack, {LanguageFactory} from "./language-pack";

export default function options(username: string,
                                password: string,
                                args: string[] = [],
                                userDataDir?: string,
                                logs = true,
                                headless = false,
                                waitLogin = 10,
                                waitElement = 1000,
                                waitExecution = 1000,
                                ignoreDefaultArgs = false,
                                language: Language | LanguagePack = Language.EN): Option {
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
        ignoreDefaultArgs: ignoreDefaultArgs,
        language: language instanceof LanguagePack ? language : LanguageFactory.get(language)
    }
}

export function buildOptions(partial: PartialOption): Option {
    return options(
        partial.username,
        partial.password,
        partial.args,
        partial.userDataDir,
        partial.logs,
        partial.headless,
        partial.waitLogin,
        partial.waitElement,
        partial.waitExecution,
        partial.ignoreDefaultArgs,
        partial.language
    )
}