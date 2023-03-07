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
    }

    protected attendance() {
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