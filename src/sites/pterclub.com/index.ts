import { NexusPHP } from "../../architectures/NexusPHP";

export class Pterclub extends NexusPHP {
    constructor() {
        super("pterclub.com");

        this.menu_items = [
            {
                "id": "bannerHide",
                "type": "switch",
                "display": "隐藏横幅",
                "name": "隐藏横幅",
                "value": false
            },
            {
                "id": "attendance",
                "type": "switch",
                "display": "自动签到",
                "name": "自动签到",
                "value": true
            }
        ].concat(this.menu_items);
    }

    protected tweakBanner(): void {
        if (this.getHostValue("bannerHide")) {
            this.css += `
table.head {
    display: none;
}
table.mainouter {
    margin-top: 20px;
}`;
        }
    }

    public onLoad(): void {
        super.onLoad();
        this.attendance();
    }

    protected addDirectLink(): void {
        if (!this.getHostValue("directLink") || this.passkey == "") {
            return;
        }

        const id_re = /id=\d+/;
        const trs = document.querySelectorAll("table.torrentname > tbody > tr:nth-of-type(1)");

        for (const tr of trs) {
            const tds = tr.querySelectorAll("td");
            if (!tds || tds.length < 5) {
                continue;
            }
            const dl = tds[3].querySelector("a");
            const direct_link = dl ? dl.href : "";
            if (direct_link == "") {
                continue;
            }
            const img = document.createElement("img");
            img.setAttribute("src", "pic/trans.gif");
            img.setAttribute("class", "torrent_direct_link");
            img.setAttribute("alt", "DL");
            const a = document.createElement("a");
            a.setAttribute("title", "左键单击复制，链接中包含个人秘钥Passkey，切勿泄露！");
            a.setAttribute("onclick", "return false");
            a.setAttribute("id", "direct_link");
            a.setAttribute("href", direct_link);
            a.setAttribute("data-clipboard-text", direct_link);
            a.appendChild(img);
            tds[4].prepend(a);
        }

        this.css += `
.swal2-container {
    z-index: 4294967295;
}
img.torrent_direct_link {
    width: 16px;
    height: 16px;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAH5QTFRFR3BMyKN4cz0Td3d3sLCw6enp////qHg4oaGhcz0TlpaWkV8opnU2lmQrjVklqHg4m2kvo3I03ruJiFMhn24y4r+N2raG5cSP9+jQg04e1rKD68uUnYpv6ceS0q5/fkkaoaGhzqp8h4eHr6+v+Pj4ekQXdkAV+/v78fHxy6Z6f0p3WgAAAAp0Uk5TAP///////5aWlrne7esAAACHSURBVBjTbc5HEsIwEERRA5qxLeecc77/BTEN0oq/m1ddKhnG36xxtPRhBq2UxyFlG5gAt5zXk+hc59IFRM3yQksTAdKOf3UpICxYCEFEXIQAL2NCnHkAJ/4s7jh2AH6uFrkPSOrvgrhOAFWvFn0FGCYWhDemAbBd6h/XBtgfuh1gP3X2fb4BlrkIUt3i2kgAAAAASUVORK5CYII=');
    padding-bottom: 1px;
}`;

        this.registerClipboard("#direct_link");
    }

    private attendance() {
        if (!this.getHostValue("attendance")) {
            return;
        }
        const span = document.querySelector("span#attendance-wrap");
        if (span && (span.innerHTML.indexOf("已") >= 0 || (span.innerHTML.indexOf("got") >= 0))) {
            return;
        }

        this.makeGetRequest("https://" + this.host + "/attendance-ajax.php").then(console.log, console.log);
    }
}
