import { NexusPHP } from "../../architectures/NexusPHP";
import { direct_link_img_url } from "../../common";

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
    background: url('${direct_link_img_url}');
    padding-bottom: 1px;
}`;

        this.registerClipboard("#direct_link");
    }

    private attendance() {
        if (!this.getHostValue("attendance")) {
            return;
        }
        const do_attendance = document.querySelector("a#do-attendance");
        if (do_attendance) {
            this.wait(2000).then(() => {
                (do_attendance as HTMLAnchorElement).click();
            });
        }
    }
}
