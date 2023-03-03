import { Common, direct_link_img_url, uaParser } from "../../common";
import ClipboardJS from "clipboard";
import Swal from "sweetalert2";
import { I18N } from "../../i18n/i18n";

export class NexusPHP extends Common {
    passkey: string = "";
    constructor(host: string) {
        super(host);

        this.menu_items = [
            {
                "id": "thanks",
                "type": "switch",
                "display": I18N[this.locale].thanks,
                "name": I18N[this.locale].thanks,
                "value": true
            },
            {
                "id": "directLink",
                "type": "switch",
                "display": I18N[this.locale].directLink,
                "name": I18N[this.locale].directLinkName,
                "value": true
            }
        ].concat(this.menu_items);
    }

    public onLoad(): void {
        super.onLoad();
        this.getPasskey();
        this.tweakBanner();
        this.sayThanks();
        this.addDirectLink();
        this.attendance();
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

        if (location.href.indexOf("/usercp.php") >= 0) {
            if (this.extractPasskey(document)) {
                return;
            }
        }

        if (uaParser.getBrowser().name == "Safari"
                && uaParser.getOS().name == "Mac OS"
                && GM_info.scriptHandler == "Tampermonkey") {
            return;
        }

        const cp_url = "https://" + this.host + "/usercp.php";
        this.makeGetRequest(cp_url).then((responseText) => {
            const container = document.implementation.createHTMLDocument().documentElement;
            container.innerHTML = responseText;
            this.extractPasskey(container);
        });
    }

    private extractPasskey(doc: Document | HTMLElement): boolean {
        const re = /[\w\d]{32}/;
        const tds = doc.querySelectorAll("td.rowfollow") as NodeListOf<HTMLTableCellElement>;
        for (const td of tds) {
            const result = re.exec(td.innerText);
            if (result) {
                this.setHostValue("passkey", result[0]);
                this.passkey = result[0];
                return true;
            }
        }
        return false;
    }

    protected tweakBanner() {}

    protected sayThanks() {
        if (!this.getHostValue("thanks") || location.href.indexOf("/details.php") < 0) {
            return;
        }
        this.wait(2000).then(() => {
            const input = document.querySelector("#saythanks") as HTMLInputElement;
            if (input && !input.disabled) {
                input.click();
            }
        }).catch(() => { console.error("Failed to say thanks."); });
    }

    protected addDirectLink() {
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

    protected registerClipboard(id: string) {
        const clip = new ClipboardJS(id);
        clip.on("success", () => {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: I18N[this.locale].copySuccess,
                showConfirmButton: false,
                timer: 2500,
                toast: true
            });
        });
        clip.on("error", err => {
            Swal.fire({
                icon: "error",
                title: I18N[this.locale].copyError,
                html: `${I18N[this.locale].copyByHand}<br><input id="cb-input" style="width: 80%" value="${err.text}">`,
                didOpen: () => {
                    document.getElementById("cb-input")?.focus();
                }
            });
        });
        return clip;
    }

    protected attendance() {
        if (!this.getHostValue("attendance")) {
            return;
        }
        if (document.body.innerText.indexOf("签到已得") >= 0 || document.body.innerText.indexOf("Attend got") >= 0) {
            return;
        }

        const attend = document.querySelector("a.faqlink");
        if (attend) {
            this.css += `
.swal2-container {
    z-index: 4294967295;
}
h2#swal2-title {
    background-color: transparent;
    background-image: none;
    border: none;
}`;
            (attend as HTMLAnchorElement).onclick = () => {
                this.makeGetRequest("https://" + this.host + "/attendance.php").then((text) => {
                    const re = /签到已得\d+|Attend got: \d+/;
                    const result = re.exec(text);
                    const icon = result ? "success" : "error";
                    const title = result ? result[0] : I18N[this.locale].attendanceFail;
                    Swal.fire({
                        position: "top",
                        icon: icon,
                        title: title,
                        showConfirmButton: false,
                        timer: 3000,
                        toast: true,
                        willOpen: (_popup) => {
                            if (result && attend.parentElement) {
                                const anchor = document.createElement("a");
                                anchor.innerHTML = result[0];
                                attend.parentElement.insertBefore(anchor, attend);
                                attend.setAttribute("style", "display: none;");
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
