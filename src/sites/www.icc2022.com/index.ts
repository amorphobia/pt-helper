import Swal from "sweetalert2";
import { NexusPHP } from "../../architectures/NexusPHP";
import { direct_link_img_url } from "../../common";
import { I18N } from "../../i18n/i18n";

export class ICC2022 extends NexusPHP {
    constructor() {
        super("www.icc2022.com");

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
    background: url('${direct_link_img_url}');
    padding-bottom: 1px;
}`;

        if (this.passkey == "") {
            if (location.href.indexOf("/torrents.php") >= 0) {
                Swal.fire({
                    position: "top-end",
                    icon: "info",
                    title: `${I18N[this.locale].noPasskey}「${I18N[this.locale].directLinkName}」`,
                    showConfirmButton: false,
                    timer: 5000,
                    toast: true
                });
            }
            return;
        }

        const id_re = /id=[\d]+/;
        const trs = document.querySelectorAll("table.torrentname > tbody > tr:nth-of-type(1)");

        for (const tr of trs) {
            const tds = tr.querySelectorAll("td");
            const td = tds[3];
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
            a.setAttribute("title", I18N[this.locale].passkeyWarning);
            a.setAttribute("onclick", "return false");
            a.setAttribute("id", "direct_link");
            a.setAttribute("href", direct_link);
            a.setAttribute("data-clipboard-text", direct_link);
            a.appendChild(img);
            td.prepend(a);
        }

        this.registerClipboard("#direct_link");
    }
}
