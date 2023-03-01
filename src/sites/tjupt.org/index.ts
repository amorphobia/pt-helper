import { NexusPHP } from "../../architectures/NexusPHP/index";
import { I18N } from "../../i18n/i18n";

export class TJUPT extends NexusPHP {
    constructor() {
        super("tjupt.org");

        this.menu_items = [
            {
                "id": "bannerFold",
                "type": "switch",
                "display": I18N[this.locale].bannerFold,
                "name": I18N[this.locale].bannerFoldName,
                "value": true
            },
            {
                "id": "bannerHide",
                "type": "switch",
                "display": I18N[this.locale].bannerHide,
                "name": I18N[this.locale].bannerHideName,
                "value": false
            },
            {
                "id": "stickyHide",
                "type": "selection",
                "display": [
                    I18N[this.locale].showAllSticky,
                    I18N[this.locale].hideSingleSticky,
                    I18N[this.locale].hideSingleDoubleSticky,
                    I18N[this.locale].hideAllSticky
                ],
                "value": 0
            },
            {
                "id": "colorBlind",
                "type": "switch",
                "display": I18N[this.locale].colorBlind,
                "name": I18N[this.locale].colorBlind,
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
