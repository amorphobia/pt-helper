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

//         if (this.getHostValue("directLink") && this.passkey != "") {
//             const id_re = /id=[\d]+/;

//             const tds = document.querySelectorAll("table.torrentname > tbody > tr:nth-of-type(1) > td:nth-of-type(3)");

//             for (const td of tds) {
//                 const dl = td.querySelector("a");
//                 const result = id_re.exec(dl?.href ?? "");
//                 if (!result) {
//                     continue;
//                 }
//                 const direct_link = `https://www.${this.host}/download.php?${result[0]}&passkey=${this.passkey}`;
//                 const img = document.createElement("img");
//                 img.setAttribute("src", "pic/trans.gif");
//                 img.setAttribute("class", "torrent_direct_link");
//                 img.setAttribute("alt", "DL");
//                 const a = document.createElement("a");
//                 a.setAttribute("title", "左键单击复制，链接中包含个人秘钥Passkey，切勿泄露！");
//                 a.setAttribute("onclick", "return false");
//                 a.setAttribute("id", "direct_link");
//                 a.setAttribute("href", direct_link);
//                 a.setAttribute("data-clipboard-text", direct_link);
//                 a.appendChild(img);
//                 td.prepend(a);
//             }

//             this.css += `
// img.torrent_direct_link {
//     width: 16px;
//     height: 16px;
//     background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAH5QTFRFR3BMyKN4cz0Td3d3sLCw6enp////qHg4oaGhcz0TlpaWkV8opnU2lmQrjVklqHg4m2kvo3I03ruJiFMhn24y4r+N2raG5cSP9+jQg04e1rKD68uUnYpv6ceS0q5/fkkaoaGhzqp8h4eHr6+v+Pj4ekQXdkAV+/v78fHxy6Z6f0p3WgAAAAp0Uk5TAP///////5aWlrne7esAAACHSURBVBjTbc5HEsIwEERRA5qxLeecc77/BTEN0oq/m1ddKhnG36xxtPRhBq2UxyFlG5gAt5zXk+hc59IFRM3yQksTAdKOf3UpICxYCEFEXIQAL2NCnHkAJ/4s7jh2AH6uFrkPSOrvgrhOAFWvFn0FGCYWhDemAbBd6h/XBtgfuh1gP3X2fb4BlrkIUt3i2kgAAAAASUVORK5CYII=');
//     padding-bottom: 1px;
// }`;

//             location.assign("javascript:registerClipboardJS('#direct_link');void(0)");
//         }

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
}
