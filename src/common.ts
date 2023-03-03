import { I18N } from "./i18n/i18n";
import { UAParser } from "ua-parser-js";

const helper_home = "https://github.com/amorphobia/pt-helper";
const num_emoji = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
export const direct_link_img_url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAH5QTFRFR3BMyKN4cz0Td3d3sLCw6enp////qHg4oaGhcz0TlpaWkV8opnU2lmQrjVklqHg4m2kvo3I03ruJiFMhn24y4r+N2raG5cSP9+jQg04e1rKD68uUnYpv6ceS0q5/fkkaoaGhzqp8h4eHr6+v+Pj4ekQXdkAV+/v78fHxy6Z6f0p3WgAAAAp0Uk5TAP///////5aWlrne7esAAACHSURBVBjTbc5HEsIwEERRA5qxLeecc77/BTEN0oq/m1ddKhnG36xxtPRhBq2UxyFlG5gAt5zXk+hc59IFRM3yQksTAdKOf3UpICxYCEFEXIQAL2NCnHkAJ/4s7jh2AH6uFrkPSOrvgrhOAFWvFn0FGCYWhDemAbBd6h/XBtgfuh1gP3X2fb4BlrkIUt3i2kgAAAAASUVORK5CYII=";

export const uaParser = new UAParser(navigator.userAgent);

const impl_localse = new Map<string, string>([
    ["en", "en"],
    ["zh", "zh-CN"],
    ["zh-CN", "zh-CN"],
    ["zh-Hans", "zh-CN"],
]);

export class Common {
    host: string = "";
    locale: string = "en";
    menu_items: any[];
    registered_items: any[];
    css: string;

    constructor(host: string) {
        this.host = host;
        for (const locale of navigator.languages) {
            const mapped_locale = impl_localse.get(locale);
            if (mapped_locale) {
                this.locale = mapped_locale;
                break;
            }
        }
        this.menu_items = [{
            "id": "feedback",
            "type": "link",
            "display": I18N[this.locale].feedback,
            "value": helper_home + "/issues"
        }];
        this.registered_items = [];
        this.css = "";
    }

    /**
     * init
     */
    public init() {
        for (const item of this.menu_items) {
            item.id = this.host + "_" + item.id;
            if ((item.type == "switch" || item.type == "selection") && GM_getValue(item.id) == null) {
                GM_setValue(item.id, item.value);
            }
        }

        this.registerMenu();
    }

    /**
     * onLoad
     */
    public onLoad(): void {}

    /**
     * addStyle
     */
    public addStyle() {
        if (typeof GM_addStyle !== "undefined") {
            GM_addStyle(this.css);
        } else {
            const style = document.createElement("style");
            style.appendChild(document.createTextNode(this.css));
            (document.querySelector("head") || document.documentElement).appendChild(style);
        }
    }

    private registerMenu() {
        for (const item of this.registered_items) {
            GM_unregisterMenuCommand(item);
        }
        this.registered_items = [];

        for (const item of this.menu_items) {
            const value = GM_getValue(item.id);
            if (value != undefined && value != null) {
                item.value = value;
            }
            let reg_item;
            switch (item.type) {
                case "switch":
                    reg_item = GM_registerMenuCommand(`${item.value ? "✅" : "❌"}${item.display}`, () => {
                        this.toggleSwitch(item);
                    });
                    break;
                case "selection":
                    reg_item = GM_registerMenuCommand(`${num_emoji[item.value]}${item.display[item.value]}`, () => {
                        this.nextSelection(item);
                    });
                    break;
                case "link":
                    reg_item = GM_registerMenuCommand(`${item.display}`, () => {
                        GM_openInTab(item.value, { active: true, insert: true, setParent: true });
                    });
                    break;
                case "text":
                    reg_item = GM_registerMenuCommand(`${item.display}`, () => {});
                    break;
                default:
                    console.log(`Unrecognized menu item: ${item.id}`);
                    break;
            }

            if (reg_item !== undefined) {
                this.registered_items.push(reg_item);
            }
        }
    }

    private toggleSwitch(item: any) {
        const status = item.value ? I18N[this.locale].turnOff : I18N[this.locale].turnOn;
        GM_setValue(item.id, !item.value);
        GM_notification({
            text: `${status}「${item.name}」\n${I18N[this.locale].reloadTakeEffect}`,
            timeout: 3500,
            onclick: () => { location.reload(); }
        });
        this.registerMenu();
    }

    private nextSelection(item: any) {
        const new_value = (item.value + 1) % item.display.length;
        GM_setValue(item.id, new_value);
        GM_notification({
            text: `${I18N[this.locale].changeTo}「${item.display[new_value]}」\n${I18N[this.locale].reloadTakeEffect}`,
            timeout: 3500,
            onclick: () => { location.reload(); }
        });
        this.registerMenu();
    }

    protected wait(ms: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    protected getHostValue(id: string): string | number | boolean {
        return GM_getValue(this.host + "_" + id);
    }

    protected setHostValue(id: string, value: string | number | boolean) {
        GM_setValue(this.host + "_" + id, value);
    }

    protected makeGetRequest(url: string): Promise<string> {
        return new Promise((resolve: (_: string) => void, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: (response) => {
                    resolve(response.responseText);
                },
                onerror: (error) => {
                    reject(error);
                }
            });
        });
    }
}
