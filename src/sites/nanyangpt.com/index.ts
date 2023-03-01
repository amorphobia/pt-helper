import { NexusPHP } from "../../architectures/NexusPHP";
import { I18N } from "../../i18n/i18n";

export class NanyangPT extends NexusPHP {
    constructor() {
        super("nanyangpt.com");

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

    public onLoad(): void {
        super.onLoad();
    }

    protected tweakBanner(): void {
        if (this.getHostValue("bannerHide")) {
            const info = document.querySelector("#info_block");
            const info_height = info?.clientHeight ? info.clientHeight + 5 : 30;
            this.css += `
table.head {
    display: none;
}

table.mainouter {
    margin-top: ${info_height}px;
}`;
        }
    }
}
