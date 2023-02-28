import { Common, direct_link_img_url } from "../../common";
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
        this.tweakBanner();
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
        this.makeGetRequest(cp_url).then((responseText) => {
            const container = document.implementation.createHTMLDocument().documentElement;
            container.innerHTML = responseText;

            const re = /[\w\d]{32}/;
            const tds = container.querySelectorAll("td.rowfollow") as NodeListOf<HTMLTableCellElement>;
            for (const td of tds) {
                const result = re.exec(td.innerText);
                if (result) {
                    this.setHostValue("passkey", result[0]);
                    this.passkey = result[0];
                    return;
                }
            }
        });
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
    background: url('${direct_link_img_url}');
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
