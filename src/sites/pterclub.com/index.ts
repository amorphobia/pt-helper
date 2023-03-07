import { NexusPHP } from "../../architectures/NexusPHP";
import { direct_link_img_url } from "../../common";
import { I18N } from "../../i18n/i18n";

export class Pterclub extends NexusPHP {
    constructor() {
        super("pterclub.com");

        this.menu_items = [
            {
                "id": "bannerHide",
                "type": "switch",
                "display": I18N[this.locale].bannerHideName,
                "name": I18N[this.locale].bannerHideName,
                "value": false
            },
            {
                "id": "attendance",
                "type": "switch",
                "display": I18N[this.locale].attendance,
                "name": I18N[this.locale].attendance,
                "value": true
            }
        ].concat(this.menu_items);
    }

    public onLoad(): void {
        super.onLoad();
    }

    protected addDirectLink(): void {
        if (!this.getHostValue("directLink")) {
            return;
        }

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
            a.setAttribute("title", I18N[this.locale].passkeyWarning);
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

    protected attendance() {
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
