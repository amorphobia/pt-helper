import { Common } from "../../common";

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
            }
        ].concat(this.menu_items);
    }

    public onLoad(): void {
        super.onLoad();
        this.getPasskey();
        if (this.getHostValue("thanks") && location.href.indexOf("/details.php") >= 0) {
            this.sayThanks();
        }
    }

    protected getPasskey() {
        const passkey = this.getHostValue("passkey");
        if (passkey != null && passkey != "") {
            this.passkey = passkey;
            return;
        }

        const cp_url = "https://" + this.host + "/usercp.php";
        GM_xmlhttpRequest({
            method: "GET",
            url: cp_url,
            headers: {
                "Accept": "text/xml"
            },
            onload: (response) => {
                if (response.status != 200) {
                    console.log("Failed to get passkey.");
                    return;
                }
                const responseXML = response.responseXML
                                  ? response.responseXML
                                  : new DOMParser().parseFromString(response.responseText, "text/html");

                const tds = responseXML.querySelectorAll("td.rowfollow");
                for (const td of tds) {
                    const tc = td as HTMLTableCellElement;
                    const re = /[\w\d]{32}/;
                    const result = re.exec(tc.innerText);
                    if (result) {
                        console.log("passkey = " + result[0]);
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
        this.passkey = ""; 
    }

    protected sayThanks() {
        this.wait(2000).then(() => {
            const input = document.querySelector("#saythanks") as HTMLInputElement;
            if (input && !input.disabled) {
                input.click();
            }
        }).catch(() => { console.log("Failed to say thanks."); });
    }
}
