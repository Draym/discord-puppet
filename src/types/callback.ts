import {ElementHandle} from "puppeteer";

export type LoadingFn = (imageUrl: string) => void
export type ValidateFn = (element: ElementHandle) => Promise<boolean>