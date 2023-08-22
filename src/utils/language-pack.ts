import Language from "../enums/language"
import * as EN from "../i18n/en.json"
import * as FR from "../i18n/fr.json"

export enum Label {
    Close = "close",
    Servers = "servers",
    Channels = "channels"
}

export default class LanguagePack {
    language: string
    values: Record<Label, string>

    public constructor(language: string, values: Record<Label, string>) {
        this.language = language
        this.values = values
    }

    value(key: Label): string {
        if (this.values[key] == null) {
            throw new Error("Label not found")
        } else {
            return this.values[key]
        }
    }
}

const parseI18n = (language: Language): Record<Label, string> => {
    switch (language) {
        case Language.EN:
            return EN
        case Language.FR:
            return FR
    }
}

class LanguageFactory {
    static get = (language: Language) => {
        switch (language) {
            case Language.EN:
                return new LanguagePack(Language.EN, parseI18n(Language.EN))
            case Language.FR:
                return new LanguagePack(Language.FR, parseI18n(Language.FR))
            default:
                throw new Error("Language not found")
        }
    }
}

export {
    LanguageFactory
}