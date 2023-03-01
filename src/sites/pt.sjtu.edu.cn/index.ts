import { NexusPHP } from "../../architectures/NexusPHP/index";
import { I18N } from "../../i18n/i18n";

export class SJTU extends NexusPHP {
    constructor() {
        super("pt.sjtu.edu.cn");

        this.menu_items = [
            {
                "id": "bannerHide",
                "type": "switch",
                "display": I18N[this.locale].bannerHideName,
                "name": I18N[this.locale].bannerHideName,
                "value": false
            }
        ].concat(this.menu_items);
    }

    protected tweakBanner(): void {
        if (this.getHostValue("bannerHide")) {
            const info = document.querySelector("#userbar");
            const info_height = info?.clientHeight ? info.clientHeight + 5 : 30;
            this.css += `
table.head {
    display: none !important;  /* set important for iOS safari */
}

table.mainouter {
    margin-top: ${info_height}px;
}`;
        }
    }
}
