import LanguagePack from "../utils/language-pack";
import Language from "../enums/language";

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
    language: LanguagePack
}

export interface PartialOption {
    logs?: boolean
    headless?: boolean
    username: string
    password: string
    userDataDir?: string
    waitElement?: number
    waitLogin?: number
    waitExecution?: number
    args?: string[]
    ignoreDefaultArgs?: boolean
    language?: Language | LanguagePack
}