import { Common } from "../../common";
import ClipboardJS from "clipboard";
import Swal from "sweetalert2";

export class NexusPHP extends Common {
    passkey: string = "";
    constructor(host: string) {
        super(host);

        this.menu_items = [
            {
                "id": "thanks",
                "type": "switch",
                "display": "自动说谢谢",
                "name": "自动说谢谢",
                "value": true
            },
            {
                "id": "directLink",
                "type": "switch",
                "display": "种子直链按钮（左键点击按钮复制直链）",
                "name": "种子直链",
                "value": true
            }
        ].concat(this.menu_items);
    }

    public onLoad(): void {
        super.onLoad();
        this.getPasskey();
        this.sayThanks();
        this.addDirectLink();
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

        const cp_url = "https://" + this.host + "/usercp.php";
        GM_xmlhttpRequest({
            method: "GET",
            url: cp_url,
            onload: (response) => {
                if (response.status != 200) {
                    console.log("Failed to get passkey.");
                    return;
                }

                const container = document.implementation.createHTMLDocument().documentElement;
                container.innerHTML = response.responseText;

                const tds = container.querySelectorAll("td.rowfollow");
                for (const td of tds) {
                    const tc = td as HTMLTableCellElement;
                    const re = /[\w\d]{32}/;
                    const result = re.exec(tc.innerText);
                    if (result) {
                        this.setHostValue("passkey", result[0]);
                        this.passkey = result[0];
                        return;
                    }
                }
            },
            onabort: () => {
                console.log("Abort to get passkey");
            },
            onerror: () => {
                console.log("Error to get passkey");
            }
        });
    }

    protected sayThanks() {
        if (!this.getHostValue("thanks") || location.href.indexOf("/details.php") < 0) {
            return;
        }
        this.wait(2000).then(() => {
            const input = document.querySelector("#saythanks") as HTMLInputElement;
            if (input && !input.disabled) {
                input.click();
            }
        }).catch(() => { console.log("Failed to say thanks."); });
    }

    protected addDirectLink() {
        if (!this.getHostValue("directLink") || this.passkey == "") {
            return;
        }

        const id_re = /id=[\d]+/;
        const tds = document.querySelectorAll("table.torrentname > tbody > tr:nth-of-type(1) > td:nth-of-type(3)");

        for (const td of tds) {
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

    protected registerClipboard(id: string) {
        const clip = new ClipboardJS(id);
        clip.on("success", () => {
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "复制成功",
                showConfirmButton: false,
                timer: 2500,
                toast: true
            });
        });
        clip.on("error", err => {
            Swal.fire({
                icon: "error",
                title: "复制失败",
                html: `请手动复制<br><input id="cb-input" style="width: 80%" value="${err.text}">`,
                didOpen: () => {
                    document.getElementById("cb-input")?.focus();
                }
            });
        });
        return clip;
    }
}
