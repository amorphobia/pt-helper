interface I18nMap {
    [key: string]: any
}

export const I18N: I18nMap = {
    en: require("./en/config.json"),
    "zh-CN": require("./zh-CN/config.json"),
}
