const helper_home = "https://github.com/amorphobia/pt-helper";
const num_emoji = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];

export class Common {
    host: string = "";
    menu_items: any[] = [{
        "id": "feedback",
        "type": "link",
        "display": "💬反馈与建议",
        "value": helper_home + "/issues"
    }];
    registered_items: any[];
    css: string;

    constructor(host: string) {
        this.host = host;
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
        const status = item.value ? "关闭" : "开启";
        GM_setValue(item.id, !item.value);
        GM_notification({
            text: `已${status}「${item.name}」\n（点击刷新网页后生效）`,
            timeout: 3500,
            onclick: () => { location.reload(); }
        });
        this.registerMenu();
    }

    private nextSelection(item: any) {
        const new_value = (item.value + 1) % item.display.length;
        GM_setValue(item.id, new_value);
        GM_notification({
            text: `切换为「${item.display[new_value]}」\n（点击刷新网页后生效）`,
            timeout: 3500,
            onclick: () => { location.reload(); }
        });
        this.registerMenu();
    }

    protected wait(ms: number) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, ms);
        });
    }

    protected getHostValue(id: string): string | number | boolean {
        return GM_getValue(this.host + "_" + id);
    }

    protected setHostValue(id: string, value: string | number | boolean) {
        GM_setValue(this.host + "_" + id, value);
    }
}
