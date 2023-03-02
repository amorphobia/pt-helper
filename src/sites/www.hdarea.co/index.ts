import Swal from "sweetalert2";
import { NexusPHP } from "../../architectures/NexusPHP";
import { direct_link_img_url } from "../../common";
import { I18N } from "../../i18n/i18n";

export class HDarea extends NexusPHP {
    constructor() {
        super("www.hdarea.co");

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
        this.attendance();
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

    protected addDirectLink(): void {
        if (!this.getHostValue("directLink") || this.passkey == "") {
            return;
        }

        const id_re = /id=[\d]+/;
        const trs = document.querySelectorAll("table.torrentname > tbody > tr:nth-of-type(1");

        for (const tr of trs) {
            const tds = tr.querySelectorAll("td");
            if (!tds || tds.length < 4) {
                continue;
            }
            const dl = tds[3].querySelector("a");
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
            tds[3].prepend(a);
        }

        this.css += `
.swal2-container {
    z-index: 4294967295;
}
h2#swal2-title {
    background-color: transparent;
}
img.torrent_direct_link {
    width: 16px;
    height: 16px;
    background: url('${direct_link_img_url}');
    paddint-bottom: 1px;
}`;

        this.registerClipboard("#direct_link");
    }

    private attendance() {
        if (!this.getHostValue("attendance")) {
            return;
        }
        const attend = document.querySelector("span#sign_in > a");
        if (attend) {
            const anchor = attend as HTMLAnchorElement;
            anchor.onclick = () => {
                this.makeGetRequest("https://" + this.host + "/sign_in.php?action=sign_in").then((text) => {
                    const repeat = text.indexOf("重") >= 0 || text.indexOf("repeat") >= 0;
                    const icon = repeat ? "info" : "success";
                    Swal.fire({
                        position: "top",
                        icon: `${icon}`,
                        title: `${text}`,
                        showConfirmButton: false,
                        timer: 3000,
                        toast: true,
                        willOpen: (_popup) => {
                            const sign_in = document.getElementById("sign_in");
                            const sign_in_done = document.getElementById("sign_in_done");
                            if (sign_in) {
                                sign_in.style.display = "none";
                            }
                            if (sign_in_done) {
                                sign_in_done.style.display = "inline";
                            }
                        }
                    });
                });
                return false;
            };
            this.wait(2000).then(() => {
                (attend as HTMLAnchorElement).click();
            });
        }
    }
}