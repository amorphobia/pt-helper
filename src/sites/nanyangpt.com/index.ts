import { NexusPHP } from "../../architectures/NexusPHP";

export class NanyangPT extends NexusPHP {
    constructor() {
        super("nanyangpt.com");

        this.menu_items = [
            {
                "id": "bannerHide",
                "type": "switch",
                "display": "隐藏横幅",
                "name": "隐藏横幅",
                "value": false
            }
        ].concat(this.menu_items);
    }

    public onLoad(): void {
        super.onLoad();

        if (this.getHostValue("bannerHide")) {
            const info = document.querySelector("#info_block");
            const info_height = info?.clientHeight ? info.clientHeight + 5 : 30;
            this.css += `
table.head {
    display: none;
}

table.mainouter {
    margin-top: ${info_height}px;
}`;
        }
    }

    protected addDirectLink(): void {
        if (!this.getHostValue("directLink") || this.passkey == "") {
            return;
        }

        const id_re = /id=[\d]+/;
        const trs = document.querySelectorAll("table.torrentname > tbody > tr:nth-of-type(1)");

        for (const tr of trs) {
            const tds = tr.querySelectorAll("td");
            const td = tds.length < 3 ? tds[1] : tds[2];
            const dl = td.querySelector("a");
            const result = id_re.exec(dl?.href ?? "");
            if (!result) {
                continue;
            }
            const direct_link = `https://${this.host}/download.php?${result[0]}&passkey=${this.passkey}`;
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
            td.prepend(a);
        }

        this.css += `
.swal2-container {
    z-index: 4294967295;
}
h2#swal2-title {
    background-color: transparent;
    background-image: none;
    border: none;
}
img.torrent_direct_link {
    width: 16px;
    height: 16px;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAH5QTFRFR3BMyKN4cz0Td3d3sLCw6enp////qHg4oaGhcz0TlpaWkV8opnU2lmQrjVklqHg4m2kvo3I03ruJiFMhn24y4r+N2raG5cSP9+jQg04e1rKD68uUnYpv6ceS0q5/fkkaoaGhzqp8h4eHr6+v+Pj4ekQXdkAV+/v78fHxy6Z6f0p3WgAAAAp0Uk5TAP///////5aWlrne7esAAACHSURBVBjTbc5HEsIwEERRA5qxLeecc77/BTEN0oq/m1ddKhnG36xxtPRhBq2UxyFlG5gAt5zXk+hc59IFRM3yQksTAdKOf3UpICxYCEFEXIQAL2NCnHkAJ/4s7jh2AH6uFrkPSOrvgrhOAFWvFn0FGCYWhDemAbBd6h/XBtgfuh1gP3X2fb4BlrkIUt3i2kgAAAAASUVORK5CYII=');
    padding-bottom: 1px;
}`;

        this.registerClipboard("#direct_link");
    }
}
