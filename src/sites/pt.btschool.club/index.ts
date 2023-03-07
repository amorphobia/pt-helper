import Swal from "sweetalert2";
import { NexusPHP } from "../../architectures/NexusPHP";
import { I18N } from "../../i18n/i18n";

export class BTSCHOOL extends NexusPHP {
    constructor() {
        super("pt.btschool.club");

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

    protected sayThanks(): void {
        // usually there are lots of pictures in btschool torrent page
        super.sayThanks(20000);
    }

    protected attendance(): void {
        if (!this.getHostValue("attendance")) {
            return;
        }
        const attend = document.querySelector("#outer [href^=\"index.php?action=addbonus\"]");
        if (!attend) {
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
}`;

        (attend as HTMLAnchorElement).onclick = () => {
            this.makeGetRequest("https://" + this.host + "/index.php?action=addbonus").then((text) => {
                const re = /今天签到您获得\d+点魔力值|Sign in today and get it\s?\d+\s?Point of magic value/;
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
                    willOpen(_popup) {
                        if (result && attend.parentElement && attend.parentElement.parentElement) {
                            attend.parentElement.parentElement.setAttribute("style", "border: none; padding: 10px; background: green");
                            attend.setAttribute("href", "index.php");
                            attend.innerHTML = `<font color="white">${result[0]}</font>`;
                        }
                    },
                });
            });
            return false;
        };
        this.wait(2000).then(() => {
            (attend as HTMLAnchorElement).click();
        })
    }
}