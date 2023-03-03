import { NexusPHP } from "../../architectures/NexusPHP";
import { I18N } from "../../i18n/i18n";

export class ZmPT extends NexusPHP {
    constructor() {
        super("zmpt.cc");

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
            this.css += `
table.head {
    display: none;
}
table.mainouter {
    margin-top: 20px;
}`
        }
    }
}
