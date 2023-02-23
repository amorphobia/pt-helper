import { NexusPHP } from "../../architectures/NexusPHP/index";

export class TJUPT extends NexusPHP {
    constructor() {
        super("tjupt.org");

        this.menu_items = [
            {
                "id": "bannerFold",
                "type": "switch",
                "display": "自动折叠横幅（隐藏时折叠设置无效）",
                "name": "自动折叠横幅",
                "value": true
            },
            {
                "id": "bannerHide",
                "type": "switch",
                "display": "隐藏横幅（隐藏时折叠设置无效）",
                "name": "隐藏横幅",
                "value": false
            },
            {
                "id": "stickyHide",
                "type": "selection",
                "display": [
                    "显示所有置顶",
                    "隐藏一重置顶",
                    "隐藏一、二重置顶",
                    "隐藏所有置顶"
                ],
                "value": 0
            },
            {
                "id": "colorBlind",
                "type": "switch",
                "display": "色盲模式",
                "name": "色盲模式",
                "value": false
            }
        ].concat(this.menu_items);
    }

    public onLoad(): void {
        super.onLoad();

        switch (this.getHostValue("stickyHide")) {
            case 3:
                this.css += `
.triple_sticky_bg {
    display: none;
}`;
                // fallsthrough
            case 2:
                this.css += `
.double_sticky_bg {
    display: none;
}`;
                // fallsthrough
            case 1:
                this.css += `
.sticky_bg {
    display: none;
}`
            default:
                break;
        }

        if (this.getHostValue("colorBlind")) {
            if (location.href.indexOf("/classes.php") >= 0) {
                const spans = document.querySelectorAll("table.main > tbody > tr > td:nth-of-type(2) > ul > li > span[style=\"color: green\"]");
                for (const span of spans) {
                    span.setAttribute("style", "color: blue");
                }
            }
        }
    }

    protected getPasskey() {
        const value = this.getHostValue("passkey");
        let passkey = "";
        if (value) {
            passkey = String(value);
        }
        if (passkey != "") {
            this.passkey = passkey;
            return;
        }
        const link = document.querySelector("[title=\"Latest Torrents\"]") as HTMLLinkElement;
        const re = /passkey=([\d\w]+)/;
        const result = re.exec(link.href);
        this.passkey = result && result.length > 1 ? result[1] : "";
        if (this.passkey != "") {
            this.setHostValue("passkey", this.passkey);
        }
    }

    protected tweakBanner(): void {
        if (this.getHostValue("bannerHide")) {
            this.css += `
.logo_img img {
    display: none;
}`;
        } else if (this.getHostValue("bannerFold")) {
            const logo_img = document.querySelector(".logo_img");
            const original_height = logo_img?.clientHeight;
            this.css += `
.logo_img {
    height: 10px;
    overflow: hidden;
    transition: height 0.5s;
}

.logo_img:hover {
    height: ${original_height}px;
}`;
        }
    }
}
